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

import { ConfigResponse } from '@networking/ConfigResponse'
import { PikaPluginSettingsDelegate, PikaPluginSettingsViewModel } from '@views/PikaPluginSettingsViewModel'
import { App, Notice, PluginSettingTab, Setting } from 'obsidian'

/*
 * `PikaPluginSettingsView` subclasses `PluginSettingTab`, and is presented via
 * Obsidian's Settings Window.
 *
 * The data used to populate this view and all the interaction with the
 * view is handled by the view's view model. All this view does is to call
 * methods on the view model and observe (via delegate) changes so it
 * can react properly.
 */
export class PikaPluginSettingsView extends PluginSettingTab implements PikaPluginSettingsDelegate {

    // Properties

    private viewModel: PikaPluginSettingsViewModel

    // Life cycle

    constructor(
        viewModel: PikaPluginSettingsViewModel,
        app: App
    ) {
        super(app, viewModel.plugin)

        this.viewModel = viewModel
    }

    // Public

    public display() {
        this.viewModel.delegate = this

        if (!this.viewModel.hasAppToken) {
            this.makeLoginView()
        } else {
            this.makeSettingsView()
        }
    }

    public hide() {
        super.hide()

        this.viewModel.delegate = undefined
    }

    // PikaPluginSettingsDelegate

    public loginDidSucceed(
        _response: ConfigResponse
    ) {
        this.display()

        new Notice(
            'Pika login succeeded'
        )
    }

    public loginDidFail(
        _error: Error
    ) {
        this.display()

        new Notice(
            'Pika login failed'
        )
    }

    public logoutDidSucceed() {
        this.display()
    }

    // Private

    private makeLoginView() {
        const { containerEl } = this

        containerEl.empty()

        new Setting(containerEl)
            .setName('App Token')
            .setDesc('Visit Pika\'s Settings → App tokens to generate one.')
            .addText(text => text
                .setPlaceholder('Enter app token')
                .setValue(this.viewModel.appToken)
                .onChange(value => {
                    this.viewModel.appToken = value
                })
            )

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Log in')
                .setCta()
                .onClick(async _ => {
                    button
                        .setDisabled(true)
                        .removeCta()
                        .setButtonText('Logging in...')

                    await this.viewModel.validate()
                })
            )
    }

    private makeSettingsView() {
        const { containerEl } = this

        containerEl.empty()
        containerEl.createEl('h2', { text: 'Posts' })

        new Setting(containerEl)
            .setName('Categories')
            .setDesc('Default list of categories for new posts.')
            .addText(text => text
                .setPlaceholder('category1, category2, category3')
                .setValue(this.viewModel.tags)
                .onChange(value => {
                    this.viewModel.tags = value
                })
            )

        new Setting(containerEl)
            .setName('Visibility')
            .setDesc('Default visibility for new posts.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                })
            )

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Log out')
                .setCta()
                .onClick(_ => {
                    this.viewModel.logout()
                })
            )
    }
}
