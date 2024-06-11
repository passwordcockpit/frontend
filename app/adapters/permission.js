/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import HalAdapter from "ember-data-hal-9000/adapter";
// import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import ENV from '../config/environment';
import { inject } from '@ember/service';

import CustomError from '../errors/custom-error';

// export default HalAdapter.extend(DataAdapterMixin, {
export default HalAdapter.extend( {
    session: inject('session'),
    
    init() {
        this._super(...arguments);
        this.host = ENV.APP.host;
        this.namespace = ENV.APP.namespace;
        let { token } = this.get('session.data.authenticated');
        this.headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json',
            "Accept": "application/json"
        };
    },

    // authorize(xhr) {
    //     let { token } = this.get('session.data.authenticated');
    //     xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    // },
    query: function (store, type, query) {
        // Check if there is the "folderId" param
        if (query.userId) {
            let url = this.buildURL('users/' + query.userId + '/permissions', null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }

            return this.ajax(url, 'GET');
        } else {
            let url = this.buildURL(type.modelName, null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }

            return this.ajax(url, 'GET', { data: query });
        }
    },
    queryRecord(store, type, query) {
        let url = this.buildURL(
            'users/' + query.userId + '/permissions'
        );

        return this.ajax(url, 'GET');
    },
    updateRecord(store, type, snapshot) {
        let data = this.serialize(snapshot, { includeId: true });
        let id = snapshot.id;
        let url = this.buildURL(
            'users/' + id + '/permissions'
        );

        return this.ajax(url, 'PUT', { data: data });
    },
    pathForType(modelName) {
        if (modelName === 'permission') {
            return 'permissions';
        }

        return modelName;
    },
    handleResponse(status, headers, payload) {
        if (this.isSuccess(status, headers, payload)) {
            return payload;
        }

        return new CustomError(status, payload);
    }
});