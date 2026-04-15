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

import PikaPlugin from '@base/PikaPlugin'
import { ConfigResponse } from '@networking/ConfigResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

/*
 * `PikaPluginSettingsDelegate` Interface, implemented by
 * the object which needs to observe events from the view model.
 */
export interface PikaPluginSettingsDelegate {

    // Triggered when login fails.
    loginDidFail(error: Error): void

    // Triggered when the login succeeds.
    loginDidSucceed(response: ConfigResponse): void

    // Triggered logout succeeds.
    logoutDidSucceed(): void
}

/*
 * This view model drives the content and interactions with the
 * plugin settings view.
 */
export class PikaPluginSettingsViewModel {

    // Properties

    public delegate?: PikaPluginSettingsDelegate
    readonly plugin: PikaPlugin
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        plugin: PikaPlugin,
        settings: StoredSettings,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.plugin = plugin
        this.settings = settings
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    // Public

    public get hasAppToken(): boolean {
        return this.settings.appToken.length > 0
    }

    public get appToken(): string {
        return this.settings.appToken
    }

    public set appToken(value: string) {
        this.settings.appToken = value
        void this.plugin.saveSettings()
    }

    public get tags(): string {
        return this.settings.defaultTags
    }

    public set tags(value: string) {
        this.settings.defaultTags = value
        void this.plugin.saveSettings()
    }

    public get visibility(): string {
        return this.settings.postVisibility
    }

    public set visibility(value: string) {
        this.settings.postVisibility = value
        void this.plugin.saveSettings()
    }

    public async validate() {
        try {
            const response = await this.networkClient.run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )

            this.delegate?.loginDidSucceed(response)
        } catch (error) {
            this.logout()
            this.delegate?.loginDidFail(error)
        }
    }

    public logout() {
        this.appToken = ''
        this.tags = ''
        this.visibility = 'draft'

        this.delegate?.logoutDidSucceed()
    }
}
