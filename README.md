#react-fb-photoselector
A React.JS Component for easy facebook-image-selecting.

##Usage

Add the script the way you like it.

Importing via `<script>` or require it inside your code when using tools like [Browserify](http://browserify.org/)
or [Webpack](https://webpack.github.io/).

> When using the `<script>` method, the component is defined into `window.MSFBPhotoSelector`.

As soon as the component is mounted. The popup for selecting an image is shown.

###Properties
#####onSelect (func, required)

Callback when the user has selected an image.
One parameter as an object with the following keys:
- `id`: The id of the image on facebook
- `url`: The url to access the image hosted on facebook

#####onCancel (func, required)

Callback when the user has canceled the selection. No parameters added.  

#####onError (func)

Callback when an error has occured.
One Parameter as an object with information about the error

#####closeOnEsc (bool)
Defines if the dialog should close when the user presses `ESC`.
This will trigger the `onCancel` callback.

#####closeOnOutsideClick (bool)
Defines if the dialog should close when clicking outside the dialog.
This will trigger the `onCancel` callback.
