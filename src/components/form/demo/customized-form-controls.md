## en-US

Customized or third-party form controls can be used in Form, too. Controls must follow these conventions:

> - It has a controlled property `value` or other name which is equal to the value of [`valuePropName`](#formitem).
> - It has event `onChange` or an event which name is equal to the value of [`trigger`](#formitem).
> - Forward the ref or pass the id property to dom to support the `scrollToField` method.
