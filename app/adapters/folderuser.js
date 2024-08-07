/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import HalAdapter from "ember-data-hal-9000/adapter";
import ENV from '../config/environment';
import { inject } from '@ember/service';

import CustomError from '../errors/custom-error';

export default HalAdapter.extend({
    session: inject('session'),

    init() {
        this._super(...arguments);
        this.host = ENV.APP.host;
        this.namespace = ENV.APP.namespace;
    },

    // Dynamically set the headers before each request
    get headers() {
        let { token } = this.get('session.data.authenticated');
        return {
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
        if (query.folderId) {
            let url = this.buildURL('folders/' + query.folderId + '/users', null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }
            
            return this.ajax(url, 'GET');
        // Check if there is the "userId" param
        } else if(query.userId){
            let url = this.buildURL('users/' + query.userId + '/folders/permissions', null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }
            
            return this.ajax(url, 'GET', { data: query });
        } else {
            let url = this.buildURL(type.modelName, null, null, 'query', query);
            if (this.sortQueryParams) {
                query = this.sortQueryParams(query);
            }

            return this.ajax(url, 'GET', { data: query });
        }
    },
    updateRecord(store, type, snapshot) {
        // Extracting the userId because of the customized id in the serializer (userId_folderId)
        let id = snapshot.id.substring(0,snapshot.id.indexOf('_'));
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
        // Extracting the userId because of the customized id in the serializer (userId_folderId)
        let id = snapshot.id.substring(0,snapshot.id.indexOf('_'));
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

        if (status === 401 && this.get('session.isAuthenticated')) {
            this.get('session').invalidate();
        }

        return new CustomError(status, payload);
    }
});