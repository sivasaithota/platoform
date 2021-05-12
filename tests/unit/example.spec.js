import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import AppHeader from '@/components/AppHeader';
import AppLogo from '@/components/AppHeader/components/Logo';
import HeaderLink from '@/components/AppHeader/components/HeaderLink';
import HeaderUser from '@/components/AppHeader/components/User';

describe('@/components/AppHeader', () => {

  it('Check render of child ', () => {
    const wrapper = shallowMount(AppHeader);
    expect(wrapper.contains(AppLogo)).to.equal(true);
    expect(wrapper.contains(HeaderLink)).to.equal(true);
    expect(wrapper.contains(HeaderUser)).to.equal(true);
  });
});
