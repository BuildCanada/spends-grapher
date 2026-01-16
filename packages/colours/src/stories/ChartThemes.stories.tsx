import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import {
    linen_pine_blend,
    lake_maritime_blend,
    linen_auburn_blend,
    linen_aurora_blend,
    pine_warm_bend,
    pine_cool_bend,
    nickel_warm_bend,
    nickel_cool_bend,
    maritime_aurora_blend,
    steel_lake_blend,
    linen_warm_bend,
    linen_cool_bend,
    nickel_auburn_blend,
    aurora_auburn_blend,
    dust_maritime_pine,
    pine_maritime_blend,
    lake_warm_bend,
    aurora_linen_blend,
    auburn_cool_bend,
    linen_lake_blend,
    pine_warm_blend,
    pine_lake_blend,
    steel_cool_bend,
    steel_warm_bend,
    maritime_pine_blend,
    steel_pine_blend,
    lake_pine_blend,
} from "../styles/themes/charts/twelve-tone"

type ChartTheme = string[]

const chartThemes: Record<string, ChartTheme> = {
    "Auburn Cool Bend": auburn_cool_bend,
    "Aurora Auburn Blend": aurora_auburn_blend,
    "Aurora Linen Blend": aurora_linen_blend,
    "Dust Maritime Pine": dust_maritime_pine,
    "Lake Maritime Blend": lake_maritime_blend,
    "Lake Pine Blend": lake_pine_blend,
    "Lake Warm Bend": lake_warm_bend,
    "Linen Auburn Blend": linen_auburn_blend,
    "Linen Aurora Blend": linen_aurora_blend,
    "Linen Cool Bend": linen_cool_bend,
    "Linen Lake Blend": linen_lake_blend,
    "Linen Pine Blend": linen_pine_blend,
    "Linen Warm Bend": linen_warm_bend,
    "Maritime Aurora Blend": maritime_aurora_blend,
    "Maritime Pine Blend": maritime_pine_blend,
    "Nickel Auburn Blend": nickel_auburn_blend,
    "Nickel Cool Bend": nickel_cool_bend,
    "Nickel Warm Bend": nickel_warm_bend,
    "Pine Cool Bend": pine_cool_bend,
    "Pine Lake Blend": pine_lake_blend,
    "Pine Maritime Blend": pine_maritime_blend,
    "Pine Warm Bend": pine_warm_bend,
    "Pine Warm Blend 2": pine_warm_blend,
    "Steel Cool Bend": steel_cool_bend,
    "Steel Lake Blend": steel_lake_blend,
    "Steel Pine Blend": steel_pine_blend,
    "Steel Warm Bend": steel_warm_bend,
}

function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#ffffff"
}

interface ThemeSwatchProps {
    colors: ChartTheme
    name: string
}

function ThemeSwatch({ colors, name }: ThemeSwatchProps) {
    return (
        <div style={{ marginBottom: "24px" }}>
            <h3
                style={{
                    margin: "0 0 8px 0",
                    fontWeight: 600,
                    fontSize: "16px",
                }}
            >
                {name}
            </h3>
            <div
                style={{
                    display: "flex",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
            >
                {colors.map((color, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: color,
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: getContrastColor(color),
                            fontSize: "10px",
                            fontFamily: "monospace",
                        }}
                        title={color}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
            <div
                style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#666",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                }}
            >
                {colors.map((color, index) => (
                    <span key={index}>{color}</span>
                ))}
            </div>
        </div>
    )
}

function AllThemes() {
    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "24px" }}>Chart Colour Themes</h2>
            <p style={{ marginBottom: "32px", color: "#666" }}>
                Pre-blended colour combinations optimized for data visualization.
                Each theme provides 12 distinct colours suitable for charts with
                multiple data series.
            </p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
                    gap: "24px",
                }}
            >
                {Object.entries(chartThemes).map(([name, colors]) => (
                    <ThemeSwatch key={name} name={name} colors={colors} />
                ))}
            </div>
        </div>
    )
}

function ThemeComparison() {
    const selectedThemes = [
        { name: "Lake Pine Blend", colors: lake_pine_blend },
        { name: "Auburn Cool Bend", colors: auburn_cool_bend },
        { name: "Steel Lake Blend", colors: steel_lake_blend },
        { name: "Linen Warm Bend", colors: linen_warm_bend },
    ]

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "24px" }}>Theme Comparison</h2>
            <p style={{ marginBottom: "32px", color: "#666" }}>
                Side-by-side comparison of popular chart themes.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {selectedThemes.map(({ name, colors }) => (
                    <div key={name}>
                        <h3 style={{ margin: "0 0 12px 0", fontWeight: 600 }}>{name}</h3>
                        <div style={{ display: "flex", gap: "4px" }}>
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: color,
                                        width: "60px",
                                        height: "80px",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        paddingBottom: "8px",
                                        color: getContrastColor(color),
                                        fontSize: "10px",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {color}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const meta: Meta = {
    title: "Design System/Colours/Chart Themes",
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

export const AllThemesStory: StoryObj = {
    name: "All Themes",
    render: () => <AllThemes />,
}

export const Comparison: StoryObj = {
    name: "Theme Comparison",
    render: () => <ThemeComparison />,
}

export const LakePineBlend: StoryObj = {
    render: () => (
        <div style={{ padding: "20px" }}>
            <ThemeSwatch name="Lake Pine Blend" colors={lake_pine_blend} />
        </div>
    ),
}

export const AuburnCoolBend: StoryObj = {
    render: () => (
        <div style={{ padding: "20px" }}>
            <ThemeSwatch name="Auburn Cool Bend" colors={auburn_cool_bend} />
        </div>
    ),
}

export const SteelLakeBlend: StoryObj = {
    render: () => (
        <div style={{ padding: "20px" }}>
            <ThemeSwatch name="Steel Lake Blend" colors={steel_lake_blend} />
        </div>
    ),
}
