// @flow

import styles from './AnnouncementsList.css';
import { Helmet } from 'react-helmet-async';
import Flex from 'app/components/Layout/Flex';
import { Form, SelectInput, TextArea } from 'app/components/Form';
import { reduxForm, Field, reset } from 'redux-form';
import Button from 'app/components/Button';
import { ContentMain } from 'app/components/Content';
import type { ActionGrant, CreateAnnouncement } from 'app/models';
import { connect } from 'react-redux';
import { selectAutocomplete } from 'app/reducers/search';

type Props = {
  createAnnouncement: (CreateAnnouncement) => Promise<*>,
  actionGrant: ActionGrant,
  handleSubmit: (Function) => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
};

let AnnouncementsCreate = ({
  createAnnouncement,
  actionGrant,
  handleSubmit,
  invalid,
  pristine,
  submitting,
}: Props) => {
  const disabledButton = invalid || pristine || submitting;

  const onSubmit = (announcement, send = false) => {
    return createAnnouncement({
      ...announcement,
      users: announcement.users.map((user) => user.value),
      groups: announcement.groups.map((group) => group.value),
      meetings: announcement.meetings.map((meeting) => meeting.value),
      events: announcement.events.map((event) => event.value),
      fromGroup: announcement.fromGroup && announcement.fromGroup.value,
      send,
    });
  };
  return (
    <ContentMain>
      <Helmet title="Kunngjøringer" />
      {actionGrant.includes('create') && (
        <Flex column>
          <h2 className={styles.header}>Ny kunngjøring</h2>
          <Form className={styles.form}>
            <Field
              className={styles.msgField}
              name="message"
              component={TextArea.Field}
              placeholder="Skriv din melding her..."
              label="Kunngjøring:"
            />
            <span className={styles.formHeaders}>Mottakere:</span>
            <Flex className={styles.rowRec}>
              <Field
                className={styles.recField}
                name="users"
                placeholder="Brukere"
                filter={['users.user']}
                isMulti
                component={SelectInput.AutocompleteField}
              />
              <Field
                name="groups"
                placeholder="Grupper"
                filter={['users.abakusgroup']}
                isMulti
                component={SelectInput.AutocompleteField}
              />
            </Flex>
            <Flex className={styles.rowRec}>
              <Field
                className={styles.recField}
                name="events"
                placeholder="Arrangementer"
                filter={['events.event']}
                isMulti
                component={SelectInput.AutocompleteField}
              />
              <Field
                name="meetings"
                placeholder="Møter"
                filter={['meetings.meeting']}
                isMulti
                component={SelectInput.AutocompleteField}
              />
            </Flex>
            <span className={styles.formHeaders}>Send på vegne av:</span>
            <Field
              name="fromGroup"
              placeholder="Fra gruppe"
              filter={['users.abakusgroup']}
              component={SelectInput.AutocompleteField}
            />
            <Flex>
              <Button
                onClick={handleSubmit((values) => onSubmit(values, false))}
                disabled={disabledButton}
              >
                Opprett
              </Button>
              <Button
                onClick={handleSubmit((values) => onSubmit(values, true))}
                disabled={disabledButton}
              >
                Opprett og send
              </Button>
            </Flex>
          </Form>
        </Flex>
      )}
    </ContentMain>
  );
};

const resetForm = (result, dispatch) => {
  dispatch(reset('announcementsCreate'));
};

const validateForm = (values) => {
  const errors = {};
  if (!values.message) {
    errors.message = 'Du må skrive en melding';
  }
  if (!values.groups && !values.meetings && !values.events && !values.users) {
    errors.users = 'Du må velge minst én mottaker';
  }
  return errors;
};

AnnouncementsCreate = reduxForm({
  form: 'announcementsCreate',
  onSubmitSuccess: resetForm,
  validate: validateForm,
})(AnnouncementsCreate);

AnnouncementsCreate = connect((state) => {
  const locationState = state.router.location.state;
  return {
    initialValues: {
      groups: locationState?.group
        ? selectAutocomplete([
            {
              contentType: 'users.abakusgroup',
              ...locationState.group,
            },
          ])
        : [],
      events: locationState?.event
        ? selectAutocomplete([
            {
              contentType: 'events.event',
              ...locationState.event,
            },
          ])
        : [],
      meetings: locationState?.meeting
        ? selectAutocomplete([
            {
              contentType: 'meetings.meeting',
              ...locationState.meeting,
            },
          ])
        : [],
      users: [],
    },
  };
})(AnnouncementsCreate);

export default AnnouncementsCreate;
