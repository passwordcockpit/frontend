/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
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
        // Check if there is the "folderId" param
        if (query.folderId) {
            let url = this.buildURL('folders/' + query.folderId + '/users', null, null, 'query', query);
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
    updateRecord(store, type, snapshot) {
        let id = snapshot.id;
        let url = this.buildURL(
            'folders/' + snapshot.adapterOptions.folder_id + '/users/' + id
        );

        return this.ajax(url, 'PATCH', { data: {
            access: snapshot.record.get('access')
        } });
    },
    createRecord(store, type, snapshot) {
        //let id = snapshot.id;
        let url = this.buildURL(
            'folders/' + snapshot.record.folder_id + '/users/' + snapshot.record.userId
        );

        return this.ajax(url, 'POST', {
            data: {
                access: snapshot.record.get('access')
            }
        });
    },
    deleteRecord(store, type, snapshot) {

        let data = this.serialize(snapshot, { includeId: true });
        let id = snapshot.id;
        let url = this.buildURL(
            'folders/' + snapshot.adapterOptions.folder_id + '/users/' + id
        );

        return this.ajax(url, 'DELETE', { data: data });
    },
    pathForType(modelName) {
        return modelName;
    },
    handleResponse(status, headers, payload) {
        if (this.isSuccess(status, headers, payload)) {
            return payload;
        }

        return new CustomError(status, payload);
    }
});