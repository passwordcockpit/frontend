/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import HalAdapter from "ember-data-hal-9000/adapter";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import ENV from '../config/environment';

import CustomError from '../errors/custom-error';

export default HalAdapter.extend(DataAdapterMixin, {
    authorizer: "authorizer:token",

    init() {
        this._super(...arguments);
        this.host = ENV.APP.host;
        this.namespace = ENV.APP.namespace;
        this.headers = {
            "Content-Type": 'application/json',
            "Accept": "application/json"
        };
    },
    query: function (store, type, query) {
        // Check if there is the "passwordId" param
        let url;
        if (query.passwordId) {
            url = this.buildURL('passwords/' + query.passwordId + '/logs', null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }
        } else {
            url = this.buildURL(type.modelName, null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }
        }
        return this.ajax(url, 'GET', { data: query });
    },
    handleResponse(status, headers, payload) {
        if (this.isSuccess(status, headers, payload)) {
            return payload;
        }

        return new CustomError(status, payload);
    }
});