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

import { PikaPluginContainerInterface } from '@base/PikaPluginContainer'
import { ServiceFactoryInterface } from '@factories/ServiceFactory'
import { MarkdownPost, MarkdownPostInterface } from '@models/MarkdownPost'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ErrorViewModel } from '@views/ErrorViewModel'
import { PikaPluginSettingsViewModel } from '@views/PikaPluginSettingsViewModel'
import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { UpdatePostViewModel } from '@views/UpdatePostViewModel'
import { MarkdownView } from 'obsidian'

export interface ViewModelFactoryInterface {

    // Builds either the `PublishPostViewModel`, for publishing a note
    // to Pika, or the `UpdatePostViewModel`, to update a post.
    makeSubmitPostViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdatePostViewModel

    // Builds the `PikaPluginSettingsViewModel`, used by the plugin
    // Settings.
    makePikaPluginSettingsViewModel(): PikaPluginSettingsViewModel

    // Builds the Empty Post Error View Model.
    makeEmptyPostErrorViewModel(): ErrorViewModel
}

/*
 * View Model Factory builds all the View Models in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ViewModelFactory implements ViewModelFactoryInterface {

    // Properties

    private container: PikaPluginContainerInterface
    private serviceFactory: ServiceFactoryInterface

    // Life cycle

    constructor(
        container: PikaPluginContainerInterface,
        serviceFactory: ServiceFactoryInterface
    ) {
        this.container = container
        this.serviceFactory = serviceFactory
    }

    // Public

    public makeSubmitPostViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdatePostViewModel {
        const frontmatterService = this.serviceFactory
            .makeFrontmatterService(markdownView.file)

        const imageService = this.serviceFactory
            .makeImageService(markdownView.file)

        const post = new MarkdownPost(
            frontmatterService,
            imageService,
            markdownView
        )

        if (post.url && post.url.length > 0) {
            return this.makeUpdatePostViewModel(
                post.url,
                post.title,
                post.content,
                post.tags || "",
                frontmatterService
            )
        } else {
            return this.makePublishPostViewModel(
                post,
                frontmatterService
            )
        }
    }

    public makePikaPluginSettingsViewModel(): PikaPluginSettingsViewModel {
        return new PikaPluginSettingsViewModel(
            this.container.plugin,
            this.container.settings,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }

    public makeEmptyPostErrorViewModel(): ErrorViewModel {
        return new ErrorViewModel(
            'Oops',
            'Pika does not support blank posts. Please write something before trying again.'
        )
    }

    // Private

    private makePublishPostViewModel(
        post: MarkdownPostInterface,
        frontmatterService: FrontmatterServiceInterface
    ): PublishPostViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

        return new PublishPostViewModel(
            post.title,
            post.content,
            post.tags || this.container.settings.defaultTags,
            this.container.settings.postVisibility,
            this.container.networkClient,
            frontmatterService,
            this.container.networkRequestFactory,
            imageService
        )
    }

    private makeUpdatePostViewModel(
        url: string,
        title: string,
        content: string,
        tags: string,
        frontmatterService: FrontmatterServiceInterface
    ): UpdatePostViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

        return new UpdatePostViewModel(
            url,
            title,
            content,
            tags,
            frontmatterService,
            this.container.networkClient,
            this.container.networkRequestFactory,
            imageService
        )
    }
}
