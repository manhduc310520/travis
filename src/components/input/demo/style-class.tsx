import React from 'react';
import { Flex, Input } from '@fabi/ui';
import type { GetProp, GetProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const styles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    border-width: ${cssVar.lineWidth};
    border-radius: ${cssVar.borderRadius};
    transition: box-shadow ${cssVar.motionDurationMid};
    &:hover {
      border: 1px solid #d9d9d9;
    }
    &:focus-visible {
      border-color: lab(66.128% 0 0);
      box-shadow: 0 0 0 4px color-mix(in oklab, lab(66.128% 0 0) 50%, transparent);
    }
  `,
}));

type InputProps = GetProps<typeof Input>;
type PasswordProps = GetProps<typeof Input.Password>;
type TextAreaProps = GetProps<typeof Input.TextArea>;
type OTPProps = GetProps<typeof Input.OTP>;
type SearchProps = GetProps<typeof Input.Search>;

const { Search, TextArea, OTP, Password } = Input;

const stylesFn: InputProps['styles'] = (info) => {
  if (info.props.size === 'medium') {
    return {
      root: {
        borderColor: '#531dab',
      },
    };
  }
  return {};
};

const stylesFnTextArea: TextAreaProps['styles'] = (
  info,
): GetProp<TextAreaProps, 'styles', 'Return'> => {
  if (info.props.showCount) {
    return {
      root: { borderColor: '#237804' },
      textarea: { resize: 'none' },
      count: { color: 'light-dark(#237804, #8fd460)' },
    };
  }
  return {};
};

const stylesFnPassword: PasswordProps['styles'] = (
  info,
): GetProp<PasswordProps, 'styles', 'Return'> => {
  if (info.props.size === 'medium') {
    return {
      root: {
        borderColor: '#F5D3C4',
      },
    };
  }
  return {};
};

const stylesFnOTP: OTPProps['styles'] = (info): GetProp<OTPProps, 'styles', 'Return'> => {
  if (info.props.size === 'medium') {
    return {
      root: {
        borderWidth: 0,
      },
      input: {
        borderColor: '#6E8CFB',
        width: 32,
      },
    };
  }
  return {};
};

const stylesFnSearch: SearchProps['styles'] = (info): GetProp<SearchProps, 'styles', 'Return'> => {
  if (info.props.size === 'large') {
    return {
      root: { color: 'light-dark(#0958d9, #65a9f3)', borderWidth: 0 },
      input: { color: 'light-dark(#0958d9, #65a9f3)', borderColor: '#0958d9' },
      prefix: { color: 'light-dark(#0958d9, #65a9f3)' },
      suffix: { color: 'light-dark(#0958d9, #65a9f3)' },
      count: { color: 'light-dark(#0958d9, #65a9f3)' },
      button: {
        root: { color: 'light-dark(#0958d9, #65a9f3)', borderColor: '#0958d9' },
        icon: { color: 'light-dark(#0958d9, #65a9f3)' },
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const classNames = styles;
  return (
    <Flex vertical gap="large">
      <Input aria-label="Object" classNames={classNames} placeholder="Object" name="input-object" />
      <Input aria-label="Function"
        classNames={classNames}
        styles={stylesFn}
        placeholder="Function"
        size="medium"
        name="input-fn"
      />
      <TextArea aria-label="Text"
        classNames={classNames}
        styles={stylesFnTextArea}
        value="TextArea"
        showCount
        name="textarea-fn"
      />
      <Password
        classNames={classNames}
        styles={stylesFnPassword}
        value="Password"
        size="medium"
        name="password-fn"
      />
      <OTP classNames={classNames} styles={stylesFnOTP} size="medium" length={6} separator="*" />
      <Search
        classNames={classNames}
        styles={stylesFnSearch}
        size="large"
        placeholder="Search"
        name="search-fn"
      />
    </Flex>
  );
};

export default App;
