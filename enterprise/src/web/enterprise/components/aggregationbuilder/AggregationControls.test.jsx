import React from 'react';
import Immutable from 'immutable';
import { mount } from 'enzyme';
import { StoreMock, StoreProviderMock } from 'helpers/mocking';
import AggregationWidgetConfig from 'enterprise/logic/aggregationbuilder/AggregationWidgetConfig';

describe('AggregationControls', () => {
  const SessionStore = StoreMock(['isLoggedIn', () => { return true; }], 'getSessionId');
  const FieldTypesStore = StoreMock('listen', ['getInitialState', () => Immutable.List()]);

  const storeProviderMock = new StoreProviderMock({
    Session: SessionStore,
  });

  jest.doMock('injection/StoreProvider', () => storeProviderMock);
  jest.doMock('enterprise/stores/FieldTypesStore', () => { return { FieldTypesStore: FieldTypesStore }; });

  /* eslint-disable-next-line global-require */
  const AggregationControls = require('./AggregationControls').default;
  const children = (<div>The spice must flow.</div>);
  const config = new AggregationWidgetConfig([], [], [], [], 'table', true);

  it('should render its children', () => {
    const wrapper = mount(<AggregationControls config={config}
                                               fields={Immutable.List([])}
                                               onChange={() => {}}>
      {children}
    </AggregationControls>);
    expect(wrapper.find('div[children="The spice must flow."]')).toHaveLength(1);
  });

  it('should have all description boxes', () => {
    const wrapper = mount(<AggregationControls config={config}
                                               fields={Immutable.List([])}
                                               onChange={() => {}}>
      {children}
    </AggregationControls>);
    expect(wrapper.find('div.description').at(0).text()).toContain('Visualization Type');
    expect(wrapper.find('div.description').at(1).text()).toContain('Row Pivots');
    expect(wrapper.find('div.description').at(2).text()).toContain('Column Pivots');
    expect(wrapper.find('div.description').at(3).text()).toContain('Sorting');
    expect(wrapper.find('div.description').at(4).text()).toContain('Series');
  });

  it('should open additional options for column pivots', () => {
    const wrapper = mount(<AggregationControls config={config}
                                               fields={Immutable.List([])}
                                               onChange={() => {}}>
      {children}
    </AggregationControls>);
    expect(wrapper.find('h3.popover-title')).toHaveLength(0);
    wrapper.find('div.description i.fa-wrench').simulate('click');
    expect(wrapper.find('h3.popover-title')).toHaveLength(1);
    expect(wrapper.find('h3.popover-title').text()).toContain('Config options');
  });
});
