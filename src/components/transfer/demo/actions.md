## en-US

You can customize operations with the `actions` prop. This example demonstrates how to customize actions, including handling disabled and loading states.

When `actions` is an array of strings, it will use the default Button component and set the strings as button text.

When `actions` is an array of React elements, it will use these elements directly as action buttons, allowing you to use custom button components, such as buttons with loading state in this example.

Note:

1. When using custom buttons, the Transfer component will automatically handle the button's disabled state and click events.
2. You can add a `disabled` property to your custom button to control its disabled state.
3. You can add an `onClick` event handler to your custom button, which will be merged with the Transfer component's internal handler.
