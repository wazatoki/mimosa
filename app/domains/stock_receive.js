export class Recipe {
    id
    name //  取引先
    slipID // 伝票NO
    slipDate // 伝票日付
    picturePath // 伝票画像ファイルへのpath

    constructor(name, slipDate, picturePath) {
        this.id = "";
        this.name = name;
        this.slipDate = slipDate || new Date("1970", "1", "1");
        this.picturePath = picturePath;
    }
};