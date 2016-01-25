const
    React = require('react'),
    Photoselector = require('react-fb-photoselector');

module.exports = React.createClass({


    /************************************************************************************************************/
    /*                                         Core Component Functions                                         */
    /*                                                                                                          */
    /* For detailed information see {@link https://facebook.github.io/react/docs/component-specs.html}          */
    /************************************************************************************************************/

    /**
     * The displayName string is used in debugging messages
     */
    displayName: 'Example',

    /**
     * The statics object allows you to define static methods that can be called on the component class
     */
    statics: {},

    /**
     * The propTypes object allows you to validate props being passed to your components. For more information about
     * propTypes, see {@link https://facebook.github.io/react/docs/reusable-components.html Reusable Components}.
     */
    propTypes: {},

    /**
     * Invoked once before the component is mounted.
     * The return value will be used as the initial value of `this.state`.
     */
    getInitialState: function() {
        return {
            selectFacebookImage: false,
            fbIsAvailable: false,
            connectionError: false,
            facebookImageUrl: ''
        };
    },

    /**
     * Invoked once and cached when the class is created.
     * Values in the mapping will be set on this.props if that prop is not specified by the parent component.
     * {@link https://facebook.github.io/react/docs/component-specs.html#getdefaultprops}
     *
     * @return {{}}
     */
    getDefaultProps: function() {
        return {}
    },

    /**
     * Invoked when a component is receiving new props.
     * This method is not called for the initial render.
     */
    componentWillReceiveProps: function(nextProps) {

    },

    componentDidMount() {
        const _this = this;

        function checkFB() {
            if(typeof FB !== 'undefined') {
                _this.setState({fbIsAvailable: true});
            }

            _this.checkForFacebookTimeout = setTimeout(checkFB, 50);
        }

        checkFB();
    },

    componentWillUnmount() {
        clearTimeout(this.checkForFacebookTimeout);
    },

    /************************************************************************************************************/
    /*                                        Custom Component Functions                                        */
    /************************************************************************************************************/

    checkForFacebookTimeout: 0,

    onClick_facebookConnect() {
        const _this = this;

        FB.login(function(response) {
            if(response && response.authResponse) {
                _this.setState({
                    connectionError: false,
                    selectFacebookImage: true
                });
            }
            else {
                _this.setState({
                    connectionError: true
                });
            }
        }, {scope: 'user_photos'});
    },

    photoselect_onCancel() {
        this.setState({
            selectFacebookImage: false
        });
    },
    photoselect_onSelect(data) {
        this.setState({
            selectFacebookImage: false,
            facebookImageUrl: data.url
        });
    },


    /************************************************************************************************************/
    /*                                        Render this awesome stuff                                         */
    /************************************************************************************************************/
    render() {
        const _this = this;

        return (
            <div>
                {_this.state.connectionError ? (
                    <div className="alert alert-warning" role="alert">
                        <strong>Not Connected!</strong> You need to connect with Facebook in order to use this dialog.
                    </div>
                ) : null}
                {!_this.state.facebookImageUrl ? (
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                            <button className="app-example__connect btn btn-block btn-facebook"
                                    onClick={_this.onClick_facebookConnect} disabled={!_this.state.fbIsAvailable}>
                                {_this.state.fbIsAvailable ? (
                                    <span>
                                        <i className="fa fa-facebook-official"></i> Connect with Facebook
                                    </span>) : (
                                    <span>
                                        <i className="fa fa-fw fa-spin fa-spinner"></i>
                                        Waiting for Facebook
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-1">
                            <div className="form-group">
                                <button className="app-example__connect btn btn-block btn-primary"
                                        onClick={_this.onClick_facebookConnect} disabled={!_this.state.fbIsAvailable}>
                                    Select another
                                </button>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="app-example__image__wrapper">
                                <img src={_this.state.facebookImageUrl} alt="Your selected image"
                                     className="app-example__image img-fluid"/>
                            </div>
                        </div>
                    </div>
                )}
                {_this.state.selectFacebookImage ?
                    <Photoselector onSelect={_this.photoselect_onSelect} onCancel={_this.photoselect_onCancel}/> : null}
            </div>
        );
    }
});
