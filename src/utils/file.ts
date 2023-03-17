
export interface GetAnchorDownloadFile {
    data: string | object
    type: string
    filename: string
}

export const getAnchorDownloadFile = (state: GetAnchorDownloadFile) => {

    const { data, filename, type } = state;

    let payload: string = "";
    if (typeof data === "object") {
        payload = JSON.stringify(data, null, 2);
    } else {
        payload = data;
    }

    //building data blob
    const blob = new Blob([payload], { type });
    //create anchor element
    const a = document.createElement("a");
    //set blob
    a.href = window.URL.createObjectURL(blob);
    //set filename
    a.download = filename;

    return a;
}