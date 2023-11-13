import {WEEKS_DATABASE_ID} from '../../config';

import DateFormatter from '../../helpers/DateFormatter';
import Page from '../Page';
import PropertiesBuilder from '../PropertiesBuilder';
import MonthMap from './MonthMap';

export default class MonthPage extends Page {
    public start: string;
    public end: string;

    private constructor(title: string, start: string, end: string) {
        super(WEEKS_DATABASE_ID, title);
        this.start = start;
        this.end = end;
    }

    static createFromDate(date: Date): MonthPage {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return new MonthPage(
            DateFormatter.prettyMonth(date),
            DateFormatter.date(firstDay),
            DateFormatter.date(lastDay)
        );
    }

    toProperties(): object {
        return new PropertiesBuilder()
            .title(MonthMap.title, this.title)
            .date(MonthMap.date, this.start, this.end)
            .build();
    }
}