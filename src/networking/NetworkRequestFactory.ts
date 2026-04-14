/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { NetworkRequest } from '@networking/NetworkRequest'
import { MediaRequest } from '@networking/MediaRequest'
import { makeNewPostRequest } from '@networking/NewPostRequest'
import { makeUpdatePostRequest } from '@networking/UpdatePostRequest'

export interface NetworkRequestFactoryInterface {

    // Builds the publish request, `NetworkRequest` used to publish a new
    // post to Pika.
    makePublishPostRequest(
        title: string,
        content: string,
        tags: string[],
        visibility: string,
        scheduledDate: string
    ): NetworkRequest

    // Builds the configuration request, `NetworkRequest` used to log in
    // the user. The config network request validates the app token.
    makeConfigRequest(): NetworkRequest

    // Builds the network request to update a post.
    makeUpdateRequest(
        url: string,
        title: string,
        content: string,
        tags?: string[]
    ): NetworkRequest

    // Builds a media upload request for uploading files to Pika.
    makeMediaUploadRequest(
        mediaBuffer: ArrayBuffer,
        filename: string,
        contentType: string
    ): MediaRequest
}

/*
 * `NetworkRequestFactory` builds all the network requests in the plugin.
 * It hides all the complexity, data transformation, etc... of building
 * network requests.
 */
export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    // Public

    public makePublishPostRequest(
        title: string,
        content: string,
        tags: string[],
        visibility: string,
        scheduledDate: string
    ): NetworkRequest {
        const body = JSON.stringify(
            makeNewPostRequest(
                title,
                content,
                tags,
                scheduledDate,
                visibility
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
        }
    }

    public makeConfigRequest(): NetworkRequest {
        return {
            path: '/micropub',
            parameters: new URLSearchParams([
                ['q', 'config']
            ]),
            method: 'GET'
        }
    }

    public makeUpdateRequest(
        url: string,
        title: string,
        content: string,
        tags?: string[]
    ): NetworkRequest {
        const body = JSON.stringify(
            makeUpdatePostRequest(
                url,
                title,
                content,
                tags
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
        }
    }

    public makeMediaUploadRequest(
        mediaBuffer: ArrayBuffer,
        filename: string,
        contentType: string
    ): MediaRequest {
        return {
            mediaBuffer,
            filename,
            contentType
        }
    }
}
