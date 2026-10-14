## en-US

Combine [dnd-kit](https://github.com/clauderic/dnd-kit) with the `move` operation provided by `Form.List` to drag and sort dynamic form items. Each field's stable `key` is used as the drag identifier, and `move(from, to)` is called on drag end to reorder items while keeping the form values in sync.
