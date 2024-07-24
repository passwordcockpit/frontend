/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

/**
* Transform error received from the backend
*/
let CustomError = function(code, payload = 'Something went wrong.') {
    
    if (payload.hasOwnProperty('detail')) {
        Error.call(this, payload.detail);
    } else {
        Error.call(this, payload);
    }
    if (payload.hasOwnProperty('errors')) {
        this.errors = payload.errors
    }
    
    this.title = payload.title
    this.code = code;
};

CustomError.prototype = Object.create(Error.prototype);

export default CustomError;