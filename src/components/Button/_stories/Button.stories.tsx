import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    isDisabled: true,
  },
};

export const WithOnPress: Story = {
  args: {
    children: "Click me",
    onPress: () => alert("Button pressed!"),
  },
};
