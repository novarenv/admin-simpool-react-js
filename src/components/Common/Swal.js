import React from 'react';
import PropTypes from 'prop-types';
// Sweet Alert
import swal from 'sweetalert';

/**
 * Wrapper component for sweetalert plugin
 */
const Swal = props => {

    const handleClick = e => {
        e.preventDefault();
        // pass swal reference so is possible to chain popups
        swal(props.options).then(p => props.callback(p, swal, props.deleterow, props.id));
    }

    const { callback, ...rest } = props;
    return (
        <div {...rest} onClick={handleClick}>
            {props.children}
        </div>
    )
}

Swal.propType = {
    /** swal options object */
    options: PropTypes.object.isRequired,
    /** callback function for swal response */
    callback: PropTypes.func,
    deleterow: PropTypes.func,
    id: PropTypes.number
}

Swal.defaultProps = {
    callback: () => {}
}

export default Swal;
