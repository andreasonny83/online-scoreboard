import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  '@global': {
    '@keyframes pendingUser': {
      '0%': { transform: 'rotateZ(0)' },
      '25%': { transform: 'rotateZ(40deg)' },
      '50%': { transform: 'rotateZ(0deg)' },
      '75%': { transform: 'rotateZ(-40deg)' },
      '100%': { transform: 'rotateZ(0deg)' },
    },
  },

  avatarWrapper: {
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },

  avatarIcon: {
    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },

  userAvatar: {
    position: 'relative',
  },

  pendingAvatarWrapper: {
    background: 'rgba(100, 100, 100, 0.9)',
    boxSizing: 'border-box',

    '& > div': {
      animation: '2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite pendingUser',
    },
  },
  pendingUser: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    background: 'red',
    borderRadius: '50%',
  },
}));
