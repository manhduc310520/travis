## en-US

You can add a custom icon to the tag via the `icon` prop. Note that the `icon` prop for CheckableTag is only supported in version `>=5.27.0`.

If you need to control the icon position, please use the `<XXXIcon />` component directly in `children` instead of the `icon` prop.

`icon` also accepts a bare `<svg>` element from a third-party icon library. It stays vertically centred with the label whether it is sized in `em` or in `px`.
