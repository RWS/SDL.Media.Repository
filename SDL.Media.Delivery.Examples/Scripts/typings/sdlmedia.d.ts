declare module SDL.MediaDelivery {
    export interface ILabelData extends SDL.MediaDelivery.IIdentifiableData {
        accountId: number;
    }
    export interface ILabelValueData extends SDL.MediaDelivery.IIdentifiableData {
        labelId: number;
    }
    export interface IIdentifiableData {
        id: number;
        name: string;
        modifiedAt?: string;
        createdAt?: string;
    }
    export interface IAsset {
        id: number;
        assetType: string;
        name: string;
        description: string;
        duration?: string;
        keywords: string[];
        tags: string[];
        labels: ILabel[];
        metadata: SDL.MediaDelivery.IAssetMetadata;
        renditionGroups: SDL.MediaDelivery.IRenditionGroup[];
        enrichments: SDL.MediaDelivery.IAssetEnrichments;
    }
    export interface IAssetBackslide {
        cultureName: string;
        entries: IEntry[];
    }
    export interface IAssetContainer {
        id: number;
        name: string;
        description: string;
        keywords: string[];
        assets: IAsset[];
    }
    export interface IAssetCustomEvent {
        name: string;
        appearsAt: string;
        value: string;
    }
    export interface IAssetEnrichments {
        backslides: IAssetBackslide[];
        customEvents: IAssetCustomEvent[];
        subtitles: IAssetSubtitle[];
        voiceovers: IAssetVoiceover[];
    }
    export interface IAssetMetadata {
        properties: any;
    }
    export interface IAssetSubtitle {
        cultureName: string;
        subRipTextFileUrl: string;
        webVideotextTrackUrl: string;
    }
    export interface IAssetVoiceover {
        cultureName: string;
        url: string;
    }
    export interface IDistribution {
        id: string;
        name: string;
        duration?: string;
        statisticsId: string;
        tenantId: string;
        outlet: SDL.MediaDelivery.IOutlet;
        enrichments: SDL.MediaDelivery.IDistributionEnrichments;
        assetContainers: SDL.MediaDelivery.IAssetContainer[];
    }
    export interface IDistributionBackslides {
        isEnabled: boolean;
        cultureName: string;
        backgroundColor: string;
        backgroundTransparency: string;
        fontSize: number;
    }
    export interface IDistributionCustomEvents {
        isEnabled: boolean;
    }
    export interface IDistributionEnrichments {
        backslides: SDL.MediaDelivery.IDistributionBackslides;
        customEvents: SDL.MediaDelivery.IDistributionCustomEvents;
        subtitles: SDL.MediaDelivery.IDistributionSubtitles;
        voiceovers: SDL.MediaDelivery.IDistributionVoiceovers;
    }
    export interface IDistributionSubtitles {
        isEnabled: boolean;
        cultureName: string;
    }
    export interface IDistributionVoiceovers {
        isEnabled: boolean;
        cultureName: string;
    }
    export interface IEntry {
        appearsAt: string;
        disappearsAt: string;
        text: string;
    }
    export interface ILabel {
        name: string;
        values: string[];
    }
    export interface IOutlet {
        id: number;
        name: string;
        outletType: string;
        properties: any;
    }
    export interface IRendition {
        name: string;
        url: string;
        properties: any;
    }
    export interface IRenditionGroup {
        name: string;
        renditions: SDL.MediaDelivery.IRendition[];
    }
}
