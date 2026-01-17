import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import {
    amethyst,
    auburn,
    aurora,
    cerulean,
    charcoal,
    copper,
    emerald,
    lake,
    linen,
    maritime,
    nickel,
    pine,
    sienna,
    steel,
} from "../styles/colours"

type ColourScale = Record<string, string>

const colourScales: Record<string, ColourScale> = {
    amethyst,
    auburn,
    aurora,
    cerulean,
    charcoal,
    copper,
    emerald,
    lake,
    linen,
    maritime,
    nickel,
    pine,
    sienna,
    steel,
}

// Get shades in numeric order from an actual scale object
function getOrderedShades(scale: ColourScale): string[] {
    return Object.keys(scale).sort((a, b) => parseInt(a) - parseInt(b))
}

function getContrastColor(hexColor: string | undefined): string {
    if (!hexColor) return "#000000"
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#ffffff"
}

interface SwatchProps {
    shade: string
    hex: string | undefined
    scaleName: string
}

function Swatch({ shade, hex, scaleName }: SwatchProps) {
    if (!hex) return null
    const textColor = getContrastColor(hex)
    const cssVar = `--color-${scaleName}-${shade}`

    return (
        <div
            style={{
                backgroundColor: hex,
                color: textColor,
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "monospace",
                fontSize: "13px",
            }}
        >
            <span style={{ fontWeight: 600 }}>{shade}</span>
            <span>{hex}</span>
        </div>
    )
}

interface ColourScaleDisplayProps {
    name: string
    scale: ColourScale
}

function ColourScaleDisplay({ name, scale }: ColourScaleDisplayProps) {
    const shades = getOrderedShades(scale)
    return (
        <div style={{ marginBottom: "32px" }}>
            <h3
                style={{
                    margin: "0 0 8px 0",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: "18px",
                }}
            >
                {name}
            </h3>
            <div
                style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
            >
                {shades.map((shade) => (
                    <Swatch
                        key={shade}
                        shade={shade}
                        hex={scale[shade]}
                        scaleName={name}
                    />
                ))}
            </div>
        </div>
    )
}

function AllScales() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
                padding: "20px",
            }}
        >
            {Object.entries(colourScales).map(([name, scale]) => (
                <ColourScaleDisplay key={name} name={name} scale={scale} />
            ))}
        </div>
    )
}

interface SingleScaleProps {
    scaleName: keyof typeof colourScales
}

function SingleScale({ scaleName }: SingleScaleProps) {
    const scale = colourScales[scaleName]
    if (!scale) return null

    return (
        <div style={{ padding: "20px", maxWidth: "400px" }}>
            <ColourScaleDisplay name={scaleName} scale={scale} />
        </div>
    )
}

const meta: Meta = {
    title: "Design System/Colours/Scales",
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

export const AllScalesStory: StoryObj = {
    name: "All Scales",
    render: () => <AllScales />,
}

export const Auburn: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="auburn" />,
}

export const Lake: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="lake" />,
}

export const Pine: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="pine" />,
}

export const Steel: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="steel" />,
}

export const Amethyst: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="amethyst" />,
}

export const Aurora: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="aurora" />,
}

export const Cerulean: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="cerulean" />,
}

export const Charcoal: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="charcoal" />,
}

export const Copper: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="copper" />,
}

export const Emerald: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="emerald" />,
}

export const Linen: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="linen" />,
}

export const Maritime: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="maritime" />,
}

export const Nickel: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="nickel" />,
}

export const Sienna: StoryObj<SingleScaleProps> = {
    render: () => <SingleScale scaleName="sienna" />,
}
