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

import { PikaPluginContainer, PikaPluginContainerInterface } from '@base/PikaPluginContainer'
import { isMarkdownView, isPublishPostViewModel, isUpdatePostViewModel } from '@extensions/TypeGuards'
import { ServiceFactory, ServiceFactoryInterface } from '@factories/ServiceFactory'
import { ViewModelFactory, ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ErrorView } from '@views/ErrorView'
import { PikaPluginSettingsView } from '@views/PikaPluginSettingsView'
import { PublishPostView } from '@views/PublishPostView'
import { UpdatePostView } from '@views/UpdatePostView'
import { Plugin } from 'obsidian'

export default class PikaPlugin extends Plugin {

    // Properties

    private settings: StoredSettings
    private container: PikaPluginContainerInterface
    private viewModelFactory: ViewModelFactoryInterface
    private serviceFactory: ServiceFactoryInterface

    // Public

    public async onload() {
        await this.loadSettings()
        this.loadDependencies()
        this.loadServiceFactory()
        this.loadViewModelFactory()

        this.addCommand({
            id: 'publish-post',
            name: 'Publish post to Pika',
            editorCallback: (editor, markdownView) => {
                if (editor.getValue().trim().length == 0) {
                    new ErrorView(
                        this.viewModelFactory.makeEmptyPostErrorViewModel(),
                        this.app
                    ).open()
                } else if (isMarkdownView(markdownView)) {
                    const viewModel = this.viewModelFactory.makeSubmitPostViewModel(
                        markdownView
                    )

                    if (isPublishPostViewModel(viewModel)) {
                        new PublishPostView(viewModel, this.app)
                            .open()
                    }

                    if (isUpdatePostViewModel(viewModel)) {
                        new UpdatePostView(viewModel, this.app)
                            .open()
                    }
                }
            }
        })

        this.addSettingTab(
            new PikaPluginSettingsView(
                this.viewModelFactory.makePikaPluginSettingsViewModel(),
                this.app
            )
        )
    }

    public onunload() { }

    public async saveSettings() {
        await this.saveData(this.settings)
    }

    // Private

    private async loadSettings() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            await this.loadData()
        )
    }

    private loadDependencies() {
        this.container = new PikaPluginContainer(
            this.settings,
            this
        )
    }

    private loadServiceFactory() {
        this.serviceFactory = new ServiceFactory(
            this.container
        )
    }

    private loadViewModelFactory() {
        this.viewModelFactory = new ViewModelFactory(
            this.container,
            this.serviceFactory
        )
    }
}
