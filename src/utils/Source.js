import * as itowns from 'itowns';


function isValidUrl (urlString) {
    try {
        return Boolean(new URL(urlString));
    } catch (e) {
        return false;
    }
}


export async function processUrl(datasetUrl, dataServerConfig) {
    const datasetsArray = [];

    let registeredDatasets;

    for (const key of datasetUrl.split(',')) {
        if (isValidUrl(key)) {
            datasetsArray.push({ url: key });
            continue;
        }

        // Try to fetch config file from server, and skip the loop step if
        // fetching it already failed.
        if (registeredDatasets === false) {
            continue;
        } else if (registeredDatasets === undefined) {
            try {
                registeredDatasets = await itowns.Fetcher.json(
                    `${dataServerConfig.baseUrl}/${dataServerConfig.configFile}`,
                );
            } catch (e) {
                registeredDatasets = false;
                continue;
            }
        }

        if (!registeredDatasets[key]) {
            console.warn(
                `Dataset key "${key}" is unknown. Please check the`
                + ` dataset keys list on the data server.`
            );
            continue;
        }


        if (!isValidUrl(registeredDatasets[key].url)) {
            registeredDatasets[key].url =
                `${dataServerConfig.baseUrl}/${registeredDatasets[key].url}`;
        }

        datasetsArray.push(registeredDatasets[key]);
    }

    return Promise.resolve(datasetsArray);
}

