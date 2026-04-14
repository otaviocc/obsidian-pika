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

import { ErrorFactory } from '@factories/ErrorFactory'
import { NetworkRequest } from '@networking/NetworkRequest'
import { MediaRequest, makeMediaRequestBody } from '@networking/MediaRequest'
import { MediaResponse, extractMediaURL } from '@networking/MediaResponse'
import { requestUrl } from 'obsidian'
import '@extensions/RequestUrlResponse'

export interface NetworkClientInterface {

    // Performs the network request. It takes a network request
    // and returns a Promise. `T` specifies the return type and is used
    // by the network client to decode the network payload.
    //
    // Returns `{}` cast to `T` when the response has no body or the body
    // is not valid JSON — Pika's update response (mf2 properties) is not
    // consumed by any view model, so we don't force callers to care.
    run<T>(request: NetworkRequest): Promise<T>

    // Performs a create request and returns the URL from the response's
    // `Location` header (Pika returns `201 Created` with no body).
    createPost(request: NetworkRequest): Promise<string>

    // Uploads a media file to Pika's media endpoint.
    // Returns a Promise with the URL of the uploaded media.
    uploadMedia(
        mediaRequest: MediaRequest
    ): Promise<string>
}

/*
 * Network Client used to perform all the network requests
 * in the plugin.
 *
 * The network client takes a closure which returns the application
 * token. This allows the app token to be resolved only when it's needed,
 */
export class NetworkClient implements NetworkClientInterface {

    // Properties

    private appToken: () => string
    private readonly pikaBaseURL = 'https://pika.page'

    // Life cycle

    constructor(
        appToken: () => string
    ) {
        this.appToken = appToken
    }

    // Public

    public async run<T>(request: NetworkRequest): Promise<T> {
        const response = await this.perform(request)

        if (!response.ok) {
            throw ErrorFactory.makeErrorFromRequestUrlResponse(response)
        }

        if (!response.text || response.text.length === 0) {
            return {} as T
        }

        try {
            return JSON.parse(response.text) as T
        } catch {
            return {} as T
        }
    }

    public async createPost(request: NetworkRequest): Promise<string> {
        const response = await this.perform(request)

        if (!response.ok) {
            throw ErrorFactory.makeErrorFromRequestUrlResponse(response)
        }

        const location = response.headers['location'] ?? response.headers['Location']

        if (!location) {
            throw new Error('Pika response did not include a Location header')
        }

        return location
    }

    public async uploadMedia(
        mediaRequest: MediaRequest
    ): Promise<string> {
        const { body, boundary } = makeMediaRequestBody(mediaRequest)
        const contentTypeHeader = `multipart/form-data; boundary=${boundary}`

        const response = await requestUrl({
            url: `${this.pikaBaseURL}/micropub/media`,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.appToken(),
                'Content-Type': contentTypeHeader
            },
            body: body,
            throw: false
        })

        if (!response.ok) {
            throw new Error(`Media upload failed (${response.status}): ${response.text}`)
        }

        try {
            const jsonResponse = JSON.parse(response.text) as MediaResponse
            return extractMediaURL(jsonResponse, response.headers['location'])
        } catch (jsonError) {
            const location = response.headers['location']
            if (location) {
                return location
            }
            throw new Error('Unable to extract media URL from response')
        }
    }

    // Private

    private async perform(request: NetworkRequest) {
        const url = this.pikaBaseURL + request.path + (request.parameters ? '?' + request.parameters : '')

        return await requestUrl({
            url,
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.appToken()
            },
            body: typeof request.body === 'string' ? request.body : undefined,
            throw: false
        })
    }
}
