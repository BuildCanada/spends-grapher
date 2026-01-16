# Spec: extractCssVariables
**Status**: Ready

## 1. Responsibility
Parse CSS content from file paths and extract all CSS custom property declarations (--variable-name: value;) into a structured format suitable for TypeScript code generation. Includes manifest-based caching to skip processing unchanged files.

## 2. Signature
- `cssFilePaths`: `string[]` - Array of file paths to CSS files to process
- `manifestPath`: `string` - Path to the manifest JSON file (tracks file modification times)
- `options`: `{ skipHexValidation?: boolean }` - Optional config. If `skipHexValidation: true`, accept all values (including `var()`, `calc()`, etc.). Default: `false` (strict hex-only validation)

## 3. Return
```typescript
{
  variables: Array<{
    name: string;          // e.g., "color-steel-50" (stripped of "--" prefix)
    originalKey: string;   // e.g., "--color-steel-50" (exact key from CSS)
    value: string;         // e.g., "#f7f8f7" (hex code only when skipHexValidation is false)
    sourceFile: string;    // e.g., "/path/to/steel.css"
  }>;
  manifest: {
    files: Record<string, { freshTil: number }>;  // filepath -> last processed timestamp
  };
  skippedFiles: Array<{   // Files that were skipped due to validation
    filePath: string;     // File path that was skipped
    reason: string;       // Human-readable reason (e.g., "Contains var() reference")
  }>;
}
```

## 4. Logic & Algorithms
1. Read existing manifest from `manifestPath` (or create new if doesn't exist)
2. For each `cssFilePath`:
    a. Get file modification time (`stat().mtime`)
    b. Check if file exists in manifest and `mtime <= freshTil`
    c. If fresh (unchanged): Skip processing, use cached variables if available
    d. If stale or new:
       - Read file content (one at a time, not in parallel)
       - Parse CSS using PostCSS
       - Extract all `--variable-name: value;` declarations
       - For each declaration:
         * Strip `--` prefix from key to create `name`
         * Keep `originalKey` as-is (with `--` prefix)
         * Validate value:
           - If `skipHexValidation` is false: Value must match `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$` regex
           - If value contains `var(--`, `calc(`, or other non-hex patterns: Skip entire file, add to `skippedFiles`
         * If valid: Add to variables array with `sourceFile`
         * If duplicate `originalKey` within same file: Keep last declaration (CSS semantics)
       - Update manifest entry with `freshTil: mtime`
3. Aggregate all variables from processed files
4. Write updated manifest to `manifestPath`
5. Return structured object with variables, manifest, and skippedFiles

## 5. Validation Rules
- `cssFilePaths`: Non-empty array of valid file paths; each file must exist
- `manifestPath`: Valid writable path for manifest JSON; directory must exist
- `options.skipHexValidation`: Boolean if provided (defaults to false)
- CSS variable keys: Must start with `--` (enforced by CSS spec, but validate)
- CSS variable values:
  - If `skipHexValidation: false` (default): Must be valid hex color (`#abc`, `#aabbcc`, `#ABC`, `#AABBCC`)
  - Cannot contain `var(--`, `calc(`, `rgb(`, `rgba(`, or function calls (causes file skip)
  - Empty values are allowed (CSS allows `--variable: ;`)

## 6. Edge Cases
- Empty `cssFilePaths` array: Return empty variables array and empty manifest
- CSS without variables: Return empty variables array, but update manifest (mark as processed)
- Duplicate variable names within a file: Keep the last declaration (CSS semantics), no warning
- Duplicate variable names across files: Keep all instances, differentiated by `sourceFile` property (expected for theme consistency)
- File not found: Throw `Error` with message `"File not found: <filePath>"`, halt processing
- Malformed CSS syntax: PostCSS will parse and extract valid declarations; unparseable sections are ignored
- Variables with complex values (e.g., `var(--other)`, `calc()`, `rgba()`): Skip entire file, add to `skippedFiles` with reason
- Comments and whitespace: Handled automatically by PostCSS parser
- Manifest corrupted/unreadable: Recreate manifest from scratch, log warning to console
- Manifest directory doesn't exist: Throw `Error` with message `"Manifest directory does not exist: <path>"`

## 7. Error Handling
- File not found: Throw `Error("File not found: <filePath>")`, halt all processing
- Invalid CSS syntax (unparseable file): PostCSS extracts what it can; unparseable sections are silently ignored
- Non-hex values when `skipHexValidation: false`: Skip file, add to `skippedFiles` with reason `"Value '<value>' is not a valid hex code"`
- Values with nested references (e.g., `var(--other)`): Skip file, add to `skippedFiles` with reason `"Contains var() reference"`
- Cannot write manifest: Throw `Error("Failed to write manifest to <manifestPath>: <cause>")`
- Cannot read manifest: Log warning `"Manifest corrupted, recreating..."` and continue with new manifest

## 8. Dependencies
- `node:fs/promises` - For file I/O operations
- `postcss` - For robust CSS parsing and extraction of custom properties
- `node:path` - For path normalization and validation

## 9. Integration Points
- Called by: Build hook / code generator
- Uses: `fs-utils.ts` (or integrates directly with file operations)
- Feeds into: TypeScript interface generator / type definition builder

## 10. Test Cases (Acceptance Criteria)

### Happy Path
**Input**:
- `cssFilePaths`: `["/src/styles/colours/steel.css"]`
- `manifestPath`: `"/dist/manifest.json"`
- File content: `--color-steel-50: #f7f8f7; --color-steel-100: #eef0ef;`
**Expected Output**:
```typescript
{
  variables: [
    { name: "color-steel-50", originalKey: "--color-steel-50", value: "#f7f8f7", sourceFile: "/src/styles/colours/steel.css" },
    { name: "color-steel-100", originalKey: "--color-steel-100", value: "#eef0ef", sourceFile: "/src/styles/colours/steel.css" }
  ],
  manifest: { files: { "/src/styles/colours/steel.css": { freshTil: <timestamp> } } },
  skippedFiles: []
}
```

### Cache Hit Path
**Input**: Same as Happy Path, run again immediately (files unchanged)
**Expected Output**: Same variables, but file not re-read from disk, manifest unchanged (same `freshTil`)

### Error Path - File Not Found
**Input**:
- `cssFilePaths`: `["/nonexistent.css"]`
**Expected Output**: Throws `Error("File not found: /nonexistent.css")`

### Edge Case - File with var() Reference
**Input**:
- `cssFilePaths`: `["/src/styles/colours/complex.css"]`
- File content: `--color-base: var(--color-primary);`
**Expected Output**:
```typescript
{
  variables: [],
  manifest: { files: {} },
  skippedFiles: [
    { filePath: "/src/styles/colours/complex.css", reason: "Contains var() reference" }
  ]
}
```

### Edge Case - Duplicate Within Same File
**Input**:
- `cssFilePaths`: `["/src/styles/colours/duplicate.css"]`
- File content: `--color-base: #ffffff; --color-base: #000000;`
**Expected Output**: Variables array with 1 item: `{ name: "color-base", originalKey: "--color-base", value: "#000000", sourceFile: "..." }` (last declaration wins)

### Edge Case - Duplicate Across Files
**Input**:
- `cssFilePaths`: `["/src/steel.css", "/src/blue.css"]`
- Both files contain: `--color-base: #ffffff;` (in steel.css) and `--color-base: #0000ff;` (in blue.css)
**Expected Output**: Variables array with 2 items, differentiated by `sourceFile`:
```typescript
[
  { name: "color-base", originalKey: "--color-base", value: "#ffffff", sourceFile: "/src/steel.css" },
  { name: "color-base", originalKey: "--color-base", value: "#0000ff", sourceFile: "/src/blue.css" }
]
```
