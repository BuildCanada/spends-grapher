import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { within, userEvent, expect } from "@storybook/test"

import { PopupForm } from "./PopupForm"
import { Button } from "../../primitives/Button"
import { TextField } from "../../primitives/TextField"
import { Checkbox } from "../../primitives/Checkbox"

const meta: Meta<typeof PopupForm> = {
    title: "Components/Feedback/PopupForm",
    component: PopupForm,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: `
A non-modal form panel that composes Dialog with form elements and action buttons.

## Usage

\`\`\`tsx
import { PopupForm, TextField, Checkbox } from "@buildcanada/components"

function MyComponent() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submitted")
    setOpen(false)
  }

  return (
    <>
      <Button text="Open Form" onClick={() => setOpen(true)} />
      <PopupForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title="Contact Us"
        position="bottom-right"
      >
        <TextField label="Name" required />
        <TextField label="Email" type="email" required />
        <Checkbox label="Subscribe to newsletter" />
      </PopupForm>
    </>
  )
}
\`\`\`

## Key Features

- **Non-blocking**: Users can still interact with the page
- **Corner positioning**: Place in any corner of the screen
- **Composable**: Works with TextField, Checkbox, and other form primitives

## Props

- **position**: Where to place the form (default: "bottom-right")
- **offset**: Distance from screen edges (default: 16px)
- **submitText** / **cancelText**: Button labels
- **isSubmitting**: Shows loading state on submit button
                `,
            },
        },
    },
    argTypes: {
        position: {
            control: "select",
            options: ["top-left", "top-right", "bottom-left", "bottom-right", "center"],
            description: "Position of the popup form on screen",
        },
        offset: {
            control: { type: "number", min: 0, max: 100 },
            description: "Distance from screen edges in pixels",
        },
        submitText: {
            control: "text",
            description: "Text for the submit button",
        },
        cancelText: {
            control: "text",
            description: "Text for the cancel button",
        },
        showCancel: {
            control: "boolean",
            description: "Whether to show the cancel button",
        },
        isSubmitting: {
            control: "boolean",
            description: "Whether the form is currently submitting",
        },
        submitDisabled: {
            control: "boolean",
            description: "Whether the submit button is disabled",
        },
    },
}

export default meta
type Story = StoryObj<typeof PopupForm>

// Page content to demonstrate non-blocking behavior
function PageContent() {
    return (
        <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
            <h1>Page Content</h1>
            <p>This content remains interactive when the form is open.</p>
            <p>
                <Button text="Clickable Button" onClick={() => alert("Button clicked!")} />
            </p>
            <p>
                <input
                    type="text"
                    placeholder="Type here while form is open..."
                    style={{ padding: "8px", width: "300px" }}
                />
            </p>
        </div>
    )
}

// Wrapper component to manage popup state
function PopupFormDemo({
    title = "Form Title",
    description,
    position = "bottom-right",
    offset,
    submitText = "Submit",
    cancelText = "Cancel",
    showCancel = true,
    children,
}: {
    title?: string
    description?: string
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    offset?: number
    submitText?: string
    cancelText?: string
    showCancel?: boolean
    children?: React.ReactNode
}) {
    const [open, setOpen] = useState(false)

    const handleSubmit = () => {
        console.log("Form submitted")
        setOpen(false)
    }

    return (
        <>
            <PageContent />
            <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1 }}>
                <Button text="Open Form" onClick={() => setOpen(true)} />
            </div>
            <PopupForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                title={title}
                description={description}
                position={position}
                offset={offset}
                submitText={submitText}
                cancelText={cancelText}
                showCancel={showCancel}
            >
                {children}
            </PopupForm>
        </>
    )
}

export const Default: Story = {
    render: () => (
        <PopupFormDemo title="Contact Us" description="We'd love to hear from you.">
            <TextField label="Name" placeholder="Your name" required />
            <TextField label="Email" type="email" placeholder="you@example.com" required />
        </PopupFormDemo>
    ),
}

export const NewsletterSignup: Story = {
    render: () => (
        <PopupFormDemo
            title="Subscribe"
            description="Get updates delivered to your inbox."
            submitText="Subscribe"
        >
            <TextField
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
            />
            <Checkbox label="I agree to receive emails" />
        </PopupFormDemo>
    ),
}

export const TopLeftPosition: Story = {
    render: () => (
        <PopupFormDemo
            title="Quick Feedback"
            position="top-left"
            submitText="Send"
        >
            <TextField label="Your feedback" placeholder="Tell us what you think..." />
        </PopupFormDemo>
    ),
}

export const CenteredPosition: Story = {
    render: () => (
        <PopupFormDemo
            title="Sign In"
            position="center"
            submitText="Sign In"
            showCancel={false}
        >
            <TextField label="Email" type="email" placeholder="you@example.com" required />
            <TextField label="Password" type="password" placeholder="Enter password" required />
            <Checkbox label="Remember me" />
        </PopupFormDemo>
    ),
}

export const NoCancel: Story = {
    render: () => (
        <PopupFormDemo
            title="Required Action"
            description="Please complete this form to continue."
            submitText="Continue"
            showCancel={false}
        >
            <Checkbox label="I accept the terms and conditions" />
        </PopupFormDemo>
    ),
}

export const CustomOffset: Story = {
    render: () => (
        <PopupFormDemo
            title="Settings"
            offset={48}
            submitText="Save"
        >
            <TextField label="Display Name" placeholder="Enter name" />
            <Checkbox label="Enable notifications" />
        </PopupFormDemo>
    ),
}

// Controlled example with submitting state
function SubmittingDemo() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setOpen(false)
    }

    return (
        <>
            <PageContent />
            <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1 }}>
                <Button text="Open Form" onClick={() => setOpen(true)} />
            </div>
            <PopupForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                title="Save Changes"
                submitText="Save"
                isSubmitting={isSubmitting}
            >
                <TextField label="Name" defaultValue="John Doe" />
                <TextField label="Email" type="email" defaultValue="john@example.com" />
            </PopupForm>
        </>
    )
}

export const WithSubmittingState: Story = {
    render: () => <SubmittingDemo />,
}

// Controlled example with validation
function ValidationDemo() {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = () => {
        if (!email.includes("@")) {
            setError("Please enter a valid email address")
            return
        }
        setOpen(false)
        setEmail("")
        setError("")
    }

    return (
        <>
            <PageContent />
            <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1 }}>
                <Button text="Open Form" onClick={() => setOpen(true)} />
            </div>
            <PopupForm
                open={open}
                onClose={() => {
                    setOpen(false)
                    setError("")
                }}
                onSubmit={handleSubmit}
                title="Subscribe"
                submitText="Subscribe"
                submitDisabled={!email}
            >
                <TextField
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                    }}
                    error={error}
                    required
                />
            </PopupForm>
        </>
    )
}

export const WithValidation: Story = {
    render: () => <ValidationDemo />,
}

// Interactive test
export const InteractiveTest: Story = {
    render: () => (
        <PopupFormDemo title="Test Form">
            <TextField label="Test Field" placeholder="Enter text" />
        </PopupFormDemo>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = canvas.getByRole("button", { name: /open form/i })
        await expect(openButton).toBeInTheDocument()
        await userEvent.click(openButton)
    },
}

export const AllPositions: Story = {
    render: function AllPositionsDemo() {
        const [openForm, setOpenForm] = useState<string | null>(null)

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
                            onClick={() => setOpenForm(key)}
                            variant={openForm === key ? "solid-auburn" : "outline-charcoal"}
                        />
                    ))}
                </div>
                {positions.map(({ key, label }) => (
                    <PopupForm
                        key={key}
                        open={openForm === key}
                        onClose={() => setOpenForm(null)}
                        onSubmit={() => setOpenForm(null)}
                        title={label}
                        position={key}
                        submitText="Submit"
                    >
                        <TextField label="Field" placeholder="Enter text" />
                    </PopupForm>
                ))}
            </>
        )
    },
}
