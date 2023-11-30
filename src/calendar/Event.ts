import {CALENDAR_IDS, CALENDAR_IGNORE_REGEXP} from '../config';

import DateFormatter from '../helpers/DateFormatter';

export default class Event {
    public id?: string;
    public isAllDay: boolean;
    public start: Date;
    public end: Date;
    public type: string;
    public status: string;
    public summary: string;
    public description?: string;
    public calendar: string;

    constructor(
        calendar: string,
        isAllDay: boolean,
        start: Date,
        end: Date,
        eventType: string,
        status: string,
        summary: string,
        description?: string
    ) {
        this.calendar = calendar;
        this.isAllDay = isAllDay;
        this.start = start;
        this.end = end;
        this.type = eventType;
        this.status = status;
        this.summary = summary;
        this.description = description;
    }

    static createCalendarAndEvent(calendar: string, calendarEvent: GoogleAppsScript.Calendar.Schema.Event): Event {
        const allDay = !!calendarEvent.start.date;
        let start: Date;
        let end: Date;
        if (allDay) {
            start = new Date(calendarEvent.start.date + 'T00:00:00');
            end = calendarEvent.end.date ? new Date(calendarEvent.end.date + 'T00:00:00') : start;
        } else {
            start = new Date(calendarEvent.start.dateTime);
            end = new Date(calendarEvent.end.dateTime);
        }

        const event = new Event(
            calendar,
            allDay,
            start,
            end,
            // @ts-ignore The library is outdated and doesn't have the eventType property
            calendarEvent.eventType,
            calendarEvent.status,
            calendarEvent.summary || '(No title)',
            calendarEvent.description || null
        );
        event.updateId(calendarEvent.id);

        return event;
    }

    get calendarId(): string {
        return CALENDAR_IDS[this.calendar];
    }

    toString() {
        let template = '%s (%s - %s) [%s]';
        if (this.isCanceled()) {
            template = '%s (canceled %s - %s) [%s]';
        }

        return Utilities.formatString(
            template,
            this.summary,
            DateFormatter.dateTime(this.start),
            DateFormatter.dateTime(this.end),
            this.calendar
        );
    }

    updateId(id: string) {
        this.id = id.split('@')[0];
    }

    isUpToDate(event: Event): boolean {
        return (
            this.id === event.id &&
            this.isAllDay === event.isAllDay &&
            this.start.toISOString() === event.start.toISOString() &&
            this.end.toISOString() === event.end.toISOString() &&
            this.type === event.type &&
            this.status === event.status &&
            this.summary === event.summary
        );
    }

    isSynchronizable(): boolean {
        return this.type === 'default' && !this.summary.match(CALENDAR_IGNORE_REGEXP);
    }

    isCanceled(): boolean {
        return this.status === 'cancelled';
    }
}
