import React, { useCallback, useRef, useState } from 'react';
import { Mentions } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';
import debounce from 'lodash/debounce';

const useStyles = createStyles((props) => {
  const { css, cssVar } = props;
  return {
    optionItem: css`
      position: relative;
    `,
    avatarImage: css`
      width: 20px;
      height: 20px;
      margin-inline-end: ${cssVar.marginXS};
    `,
  };
});

const App: React.FC = () => {
  const { styles } = useStyles();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ login: string; avatar_url: string }[]>([]);
  const ref = useRef<string>(null);

  const loadGithubUsers = (key: string) => {
    if (!key) {
      setUsers([]);
      return;
    }

    fetch(`/mock-api/github/search/users?q=${key}`)
      .then((res) => res.json())
      .then(({ items = [] }) => {
        if (ref.current !== key) {
          return;
        }
        setLoading(false);
        setUsers(items.slice(0, 10));
      });
  };

  const debounceLoadGithubUsers = useCallback(debounce(loadGithubUsers, 800), []);

  const onSearch = (search: string) => {
    console.log('Search:', search);
    ref.current = search;
    setLoading(!!search);
    setUsers([]);

    debounceLoadGithubUsers(search);
  };

  return (
    <Mentions aria-label="Mention"
      style={{ width: '100%' }}
      loading={loading}
      onSearch={onSearch}
      options={users.map(({ login, avatar_url: avatar }) => ({
        key: login,
        value: login,
        className: styles.optionItem,
        label: (
          <>
            <img
              className={styles.avatarImage}
              draggable={false}
              src={avatar}
              title={login}
              alt={login}
            />
            <span>{login}</span>
          </>
        ),
      }))}
    />
  );
};

export default App;
