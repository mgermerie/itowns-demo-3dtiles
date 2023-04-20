import * as itowns from 'itowns';


function isValidUrl (urlString) {
    try {
        return Boolean(new URL(urlString));
    } 
    catch (e) {
        return false;
    }
}


export async function processUrl(datasetUrl) {
    const urlArray = [];

    let registeredDatasets;

    for (const url of datasetUrl.split(',')) {
        if (isValidUrl(url)) {
            urlArray.push({ url });
            continue;
        }

        if (!registeredDatasets) {
            registeredDatasets = await itowns.Fetcher.json(
                './resources/known_datasets.json',
            );
        }
        
        if (!registeredDatasets[url]) {
            console.warn(
                `Dataset key "${url}" is unknown. Please check the`
                + ` dataset keys list.`
            );
            continue;
        }

        urlArray.push(registeredDatasets[url]);
    }

    return Promise.resolve(urlArray);
}

