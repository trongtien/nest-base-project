import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertString {
    public convertStringToSlug(option: { text: string; slugConvert?: string }): string {
        const { text, slugConvert = '-' } = option;
        let slug;
        slug = text.toLowerCase();

        slug = text.toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');

        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        slug = slug.replace(/ /gi, slugConvert);
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');

        return slug?.trim();
    }

    public convertQueryStringToArray(queyString: string | undefined): number[] | undefined {
        if (!queyString) {
            return undefined;
        }

        const partArray: number[] =
            queyString
                .split(',')
                ?.filter((queyString) => queyString.length !== 0 && queyString !== undefined)
                ?.map((numberQuery) => +numberQuery) ?? [];

        return Array.isArray(partArray) ? partArray : [partArray];
    }

    public convertParamKeyCachePaging(option: object): string {
        return Object.entries(option)
            .map(([key, val]) => {
                if (val !== undefined && val !== null) {
                    return `${key}=${val}`;
                }
            })
            .filter((element) => element !== undefined)
            .join('&');
    }

    public convertSlugCustomer(firstName: string, lastName: string): string {
        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        return this.convertStringToSlug({ text: fullName });
    }

    public static convertValueEnum<T extends string | number>(e: any): T[] {
        return typeof e === 'object' ? Object.keys(e).map((key) => e[key]) : [];
    }
}
