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
import { FrontmatterService, FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ImageService, ImageServiceInterface } from '@services/ImageService'
import { TFile } from 'obsidian'

export interface ServiceFactoryInterface {

    // Builds the frontmatter service for the giving file.
    makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface

    // Builds an image service for processing and uploading images
    makeImageService(
        file: TFile | null
    ): ImageServiceInterface
}

/*
 * `ServiceFactory` builds all the Services in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ServiceFactory implements ServiceFactoryInterface {

    // Properties

    private container: PikaPluginContainerInterface

    // Life cycle

    constructor(
        container: PikaPluginContainerInterface
    ) {
        this.container = container
    }

    // Public

    public makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface {
        return new FrontmatterService(
            this.container.plugin.app,
            file
        )
    }

    public makeImageService(
        file: TFile | null
    ): ImageServiceInterface {
        const frontmatterService = this.makeFrontmatterService(
            file
        )

        return new ImageService(
            this.container.plugin.app,
            frontmatterService,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }
}
