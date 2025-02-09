import moment from 'moment-timezone';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'app/components/Layout';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { colorForEvent } from 'app/routes/events/utils';
import styles from './CompactEvents.css';
import type { CSSProperties } from 'react';

type Props = {
  events: Array<Record<string, any>>;
  style?: CSSProperties;
};

export default class CompactEvents extends Component<Props> {
  render() {
    const { events, style } = this.props;

    const mapEvents = (eventTypes) => {
      return events
        .filter(
          (event) =>
            moment(event.endTime).isAfter() &&
            eventTypes.includes(event.eventType)
        )
        .slice(0, 5)
        .map((event, key) => (
          <li key={key}>
            <span
              style={{
                color: colorForEvent(event.eventType),
                fontSize: '15px',
                lineHeight: '0',
                marginRight: '10px',
              }}
            >
              <i className="fa fa-circle" />
            </span>
            <Link to={`/events/${event.slug}`}>{event.title}</Link>
            {event.pinned && (
              <Tooltip content="Dette arrangementet er festet til forsiden">
                <i
                  className="fa fa-thumb-tack"
                  style={{
                    transform: 'rotate(-20deg)',
                    marginRight: '4px',
                    color: 'var(--lego-red-color)',
                  }}
                />
              </Tooltip>
            )}
            <Time
              format="dd D.MM"
              time={event.startTime}
              style={{
                flex: '0 1 0',
              }}
            />
          </li>
        ));
    };

    const presentations = mapEvents([
      'company_presentation',
      'lunch_presentation',
      'alternative_presentation',
      'course',
      'breakfast_talk',
      'kid_event',
    ]);
    const leftEvents =
      presentations.length > 0 ? presentations : ['Ingen presentasjoner'];
    const other = mapEvents(['other', 'event', 'social', 'party']);
    const rightEvents = other.length > 0 ? other : ['Ingen arrangementer'];

    if (!events.length) {
      return null;
    }

    return (
      <Flex column style={style}>
        <Flex wrap className={styles.compactEvents}>
          <Flex column className={styles.compactLeft}>
            <Link
              to={{
                pathname: '/events',
                state: {
                  filterEventType: ['showCompanyPresentation', 'showCourse'],
                },
              }}
            >
              <h3 className="u-ui-heading">Bedpres og kurs</h3>
            </Link>
            <ul className={styles.innerList}>{leftEvents}</ul>
          </Flex>
          <Flex column className={styles.compactRight}>
            <Link
              to={{
                pathname: '/events',
                state: {
                  filterEventType: ['showSocial', 'showOther'],
                },
              }}
            >
              <h3 className="u-ui-heading">Arrangementer</h3>
            </Link>
            <ul className={styles.innerList}>{rightEvents}</ul>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
