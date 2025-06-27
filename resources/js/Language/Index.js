import Helper from '../Helper'

function Index()
{
    let getLang = window._.isEmpty(Helper.getStorageData('accept_lang')) ? 'en' : Helper.getStorageData('accept_lang');
    return require('./' + getLang);
}

export const Language = Index;
