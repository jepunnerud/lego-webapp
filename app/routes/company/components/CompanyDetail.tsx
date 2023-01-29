import moment from 'moment-timezone';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import InfoBubble from 'app/components/InfoBubble';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NavigationTab from 'app/components/NavigationTab';
import { jobType, Year } from 'app/routes/joblistings/components/Items';
import EventItem from 'app/routes/overview/components/EventItem';
import { renderMeta } from 'app/routes/overview/components/utils';
import type { DetailedCompany } from 'app/store/models/Company';
import type { ListEvent } from 'app/store/models/Event';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import styles from './Company.css';

type Props = {
  company: DetailedCompany;
  companyEvents: ListEvent[];
  joblistings: ListJoblisting[];
  showFetchMoreEvents: boolean;
  fetchMoreEvents: () => Promise<any>;
  loggedIn: boolean;
};
type EventProps = {
  companyEvents: Array<Record<string, any>>;
  showFetchMoreEvents: boolean;
  fetchMoreEvents: () => Promise<any>;
  loggedIn: boolean;
};

function insertInfoBubbles(company) {
  const infos = [
    ['call', company.phone, 'Telefon'],
    ['at', company.website, 'Nettside'],
    ['home', company.address, 'Adresse'],
    ['briefcase', company.companyType, 'Type bedrift'],
  ];
  return (
    <div className={styles.infoBubbles}>
      {infos.map((info, i) => (
        <InfoBubble
          key={info[0]}
          icon={info[0]}
          data={info[1]}
          meta={info[2]}
          style={{
            order: i,
          }}
          link={info[1] && info[1].includes('.') ? info[1] : undefined}
          small
        />
      ))}
    </div>
  );
}

class CompanyEvents extends Component<EventProps, any> {
  state = {
    viewOld: false,
    eventsToShow: 3,
  };

  render() {
    const { viewOld } = this.state;
    const { loggedIn, companyEvents, showFetchMoreEvents, fetchMoreEvents } =
      this.props;
    const sortedEvents = companyEvents.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    const upcomingEvents = sortedEvents.filter((event) =>
      moment().isBefore(moment(event.startTime))
    );
    const oldEvents = sortedEvents.filter((event) =>
      moment().isAfter(moment(event.startTime))
    );

    const EventTable = ({ events }) =>
      events.map((event) => (
        <EventItem
          key={event.id}
          item={event}
          url={`/events/${event.id}`}
          meta={renderMeta(event)}
          loggedIn={loggedIn}
          isFrontPage={false}
        />
      ));

    return (
      <div>
        <table className={styles.companyEventTable}>
          <EventTable events={upcomingEvents} />
          <tr>
            <div className={styles.companyEventsShowMore}>
              <button
                className={styles.showAllEventsButton}
                onClick={() =>
                  this.setState({
                    viewOld: !this.state.viewOld,
                  })
                }
              >
                {viewOld ? 'Vis kun kommende' : 'Vis tidligere arrangementer'}
              </button>
            </div>
          </tr>
          {viewOld && <EventTable events={oldEvents} />}
        </table>
        {viewOld && showFetchMoreEvents && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: '10px',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="chevron-down-circle-outline"
              size={35}
              onClick={fetchMoreEvents}
              style={{
                cursor: 'pointer',
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

const CompanyDetail = (props: Props) => {
  const {
    company,
    companyEvents,
    joblistings,
    fetchMoreEvents,
    showFetchMoreEvents,
    loggedIn,
  } = props;

  if (!company) {
    return <LoadingIndicator loading />;
  }

  const joblistingsList =
    joblistings &&
    joblistings.map((joblisting) => (
      <tr key={joblisting.id}>
        <td>
          <Link to={`/joblistings/${joblisting.id}`}>{joblisting.title}</Link>
        </td>
        <td>{jobType(joblisting.jobType)}</td>
        <td>
          <Year joblisting={joblisting} />
        </td>
        <td>
          {
            // TODO: this doesn't work, because applicationUrl doesn't exist with list-serializer
            joblisting.applicationUrl && (
              <a
                href={joblisting.applicationUrl}
                target="_blank"
                rel="noreferrer"
              >
                <strong>SØK HER</strong>
              </a>
            )
          }
        </td>
      </tr>
    ));
  return (
    <Content>
      <Helmet title={company.name} />
      {company.logo && (
        <div>
          <Image
            src={company.logo}
            className={styles.companyImage}
            alt={`${company.name} logo`}
          />
        </div>
      )}

      <NavigationTab
        title={company.name}
        back={{
          label: 'Tilbake til liste',
          path: '/companies',
        }}
      />

      <div className={styles.description}>
        <p>{company.description}</p>
      </div>

      {insertInfoBubbles(company)}

      <h3
        style={{
          marginTop: '20px',
        }}
      >
        Bedriftens arrangementer
      </h3>
      {companyEvents.length > 0 ? (
        <CompanyEvents
          companyEvents={companyEvents}
          showFetchMoreEvents={showFetchMoreEvents}
          fetchMoreEvents={fetchMoreEvents}
          loggedIn={loggedIn}
        />
      ) : (
        <i>Ingen arrangementer.</i>
      )}
      <h3
        style={{
          marginTop: '20px',
        }}
      >
        Bedriftens jobbannonser
      </h3>
      {joblistingsList.length > 0 ? (
        <table className={styles.companyEventTable}>
          <thead>
            <tr>
              <th>Tittel</th>
              <th>Jobbtype</th>
              <th>Klassetrinn</th>
              <th>Søknadslenke</th>
            </tr>
          </thead>
          <tbody>{joblistingsList}</tbody>
        </table>
      ) : (
        <i>Ingen jobbannonser.</i>
      )}
    </Content>
  );
};

export default CompanyDetail;
