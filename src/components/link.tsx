import { Link as MuiLink } from '@mui/material';
import type { LinkProps as MuiLinkProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

const Link = forwardRef<HTMLAnchorElement, MuiLinkProps & RouterLinkProps>(
  (props, ref) => <MuiLink component={RouterLink} ref={ref} {...props} />
);

Link.displayName = 'Link';

export default Link;
