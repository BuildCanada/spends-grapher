import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"

import { Dialog } from "./Dialog"
import { Button } from "../../primitives/Button"

const meta: Meta<typeof Dialog> = {
    title: "Components/Feedback/Dialog",
    component: Dialog,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `
A non-modal floating panel that doesn't block interaction with the rest of the UI.

## Usage

\`\`\`tsx
import { Dialog } from "@buildcanada/components"

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button text="Open Dialog" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog Title"
        position="bottom-right"
      >
        <p>Dialog content goes here.</p>
      </Dialog>
    </>
  )
}
\`\`\`

## Key Features

- **Non-modal**: Does not block interaction with the rest of the UI
- **Content-sized**: Automatically sizes to fit its contents
- **Corner positioning**: Place in any corner or center of the screen
- **No rounded corners**: Sharp edges for a clean, modern look

## Positions

- \`top-left\`
- \`top-right\`
- \`bottom-left\`
- \`bottom-right\` (default)
- \`center\`

## Offset

Use the \`offset\` prop to control distance from screen edges (default: 16px).
                `,
            },
        },
    },
    argTypes: {
        position: {
            control: "select",
            options: ["top-left", "top-right", "bottom-left", "bottom-right", "center"],
            description: "Position of the dialog on screen",
        },
        offset: {
            control: { type: "number", min: 0, max: 100 },
            description: "Distance from screen edges in pixels",
        },
        closeOnEscape: {
            control: "boolean",
            description: "Whether pressing Escape closes the dialog",
        },
        showCloseButton: {
            control: "boolean",
            description: "Whether to show the close button",
        },
    },
}

export default meta
type Story = StoryObj<typeof Dialog>

// Page content to demonstrate non-blocking behavior
function PageContent() {
    return (
        <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
            <h1>Page Content</h1>
            <p>This content remains interactive when the dialog is open.</p>
            <p>
                <Button text="Clickable Button" onClick={() => alert("Button clicked!")} />
            </p>
            <p>
                <input
                    type="text"
                    placeholder="Type here while dialog is open..."
                    style={{ padding: "8px", width: "300px" }}
                />
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </div>
    )
}

// Wrapper component to manage dialog state
function DialogDemo({
    position = "bottom-right",
    title = "Dialog Title",
    description,
    offset,
    closeOnEscape = true,
    showCloseButton = true,
    children,
    buttonText = "Open Dialog",
}: {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    title?: string
    description?: string
    offset?: number
    closeOnEscape?: boolean
    showCloseButton?: boolean
    children?: React.ReactNode
    buttonText?: string
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <PageContent />
            <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1 }}>
                <Button text={buttonText} onClick={() => setOpen(true)} />
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                description={description}
                position={position}
                offset={offset}
                closeOnEscape={closeOnEscape}
                showCloseButton={showCloseButton}
            >
                {children || (
                    <p style={{ fontFamily: "sans-serif", margin: 0, maxWidth: "280px" }}>
                        This dialog doesn't block interaction with the page behind it.
                    </p>
                )}
            </Dialog>
        </>
    )
}

export const Default: Story = {
    render: () => <DialogDemo />,
}

export const TopLeft: Story = {
    render: () => (
        <DialogDemo position="top-left" title="Top Left">
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Positioned in the top-left corner.
            </p>
        </DialogDemo>
    ),
}

export const TopRight: Story = {
    render: () => (
        <DialogDemo position="top-right" title="Top Right">
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Positioned in the top-right corner.
            </p>
        </DialogDemo>
    ),
}

export const BottomLeft: Story = {
    render: () => (
        <DialogDemo position="bottom-left" title="Bottom Left">
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Positioned in the bottom-left corner.
            </p>
        </DialogDemo>
    ),
}

export const BottomRight: Story = {
    render: () => (
        <DialogDemo position="bottom-right" title="Bottom Right">
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Positioned in the bottom-right corner (default).
            </p>
        </DialogDemo>
    ),
}

export const Centered: Story = {
    render: () => (
        <DialogDemo position="center" title="Centered">
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Centered on the screen.
            </p>
        </DialogDemo>
    ),
}

export const WithDescription: Story = {
    render: () => (
        <DialogDemo
            title="Notifications"
            description="You have 3 unread messages."
        >
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                Check your inbox for details.
            </p>
        </DialogDemo>
    ),
}

export const CustomOffset: Story = {
    render: () => (
        <DialogDemo position="bottom-right" title="Custom Offset" offset={48}>
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                This dialog has a 48px offset from the edges.
            </p>
        </DialogDemo>
    ),
}

export const NoCloseButton: Story = {
    render: () => (
        <DialogDemo
            title="No Close Button"
            showCloseButton={false}
            description="Press Escape to close."
        >
            <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                This dialog has no close button in the header.
            </p>
        </DialogDemo>
    ),
}

export const WideContent: Story = {
    render: () => (
        <DialogDemo title="Wide Content">
            <div style={{ fontFamily: "sans-serif", width: "400px" }}>
                <p>This dialog has wider content and will size accordingly.</p>
                <p>The dialog always sizes to fit its contents.</p>
            </div>
        </DialogDemo>
    ),
}

// Interactive test
export const InteractiveTest: Story = {
    render: () => <DialogDemo title="Test Dialog" />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // Find and click the open button
        const openButton = canvas.getByRole("button", { name: /open dialog/i })
        await expect(openButton).toBeInTheDocument()
        await userEvent.click(openButton)
    },
}

export const AllPositions: Story = {
    render: function AllPositionsDemo() {
        const [openDialog, setOpenDialog] = useState<string | null>(null)

        const positions = [
            { key: "top-left", label: "Top Left" },
            { key: "top-right", label: "Top Right" },
            { key: "bottom-left", label: "Bottom Left" },
            { key: "bottom-right", label: "Bottom Right" },
            { key: "center", label: "Center" },
        ] as const

        return (
            <>
                <PageContent />
                <div style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    zIndex: 1
                }}>
                    {positions.map(({ key, label }) => (
                        <Button
                            key={key}
                            text={label}
                            onClick={() => setOpenDialog(key)}
                            variant={openDialog === key ? "solid-auburn" : "outline-charcoal"}
                        />
                    ))}
                </div>
                {positions.map(({ key, label }) => (
                    <Dialog
                        key={key}
                        open={openDialog === key}
                        onClose={() => setOpenDialog(null)}
                        title={label}
                        position={key}
                    >
                        <p style={{ fontFamily: "sans-serif", margin: 0 }}>
                            Positioned: {label}
                        </p>
                    </Dialog>
                ))}
            </>
        )
    },
}
