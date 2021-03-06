import {useObservableState} from 'observable-hooks';
import React from 'react';
import {EventStatus} from 'matrix-js-sdk';
import {View, Pressable} from 'react-native';
import {SenderText, BubbleWrapper} from '../MessageItem';
// import { isIos } from '../../../utilities/misc';
// import { isEmoji } from '../../../utilities/emojis';
// import Html from '../Html';
// import {colors} from '../../../constants';
// import Icon from '../Icon';
import {matrix} from '@rn-matrix/core';
import {isIos} from '../../../../../../shared/utilities';
import {useTheme, Text} from '@ui-kitten/components';

// const debug = require('debug')('rnm:views:components:messageTypes:TextMessage');

export default function TextMessage({
  message,
  prevSame,
  nextSame,
  onPress = () => {},
  onLongPress = () => {},
  showReactions = false,
  myBubbleStyle = () => {},
  otherBubbleStyle = () => {},
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = {prevSame, nextSame};
  const isMe = myUser?.id === message.sender.id;

  const theme = useTheme();

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);

  const isEmoji = (text) => {
    return false;
  };

  const getDefaultBackgroundColor = (me, pressed) => {
    return me
      ? pressed
        ? theme['color-info-500']
        : theme['color-info-400']
      : pressed
      ? theme['color-basic-400']
      : theme['color-basic-300'];
  };

  if (!content?.html) return null;
  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        message={message}
        prevSame={prevSame}
        nextSame={nextSame}
        showReactions={showReactions}>
        {isEmoji(content?.text) ? (
          <Emoji
            style={!isIos() ? {fontFamily: 'NotoColorEmoji'} : {}}
            isMe={isMe}
            {...props}>
            {content.text}
          </Emoji>
        ) : (
          <View style={viewStyle(nextSame)}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Pressable
                {...props}
                // onPress={onPress ? _onPress : null}
                // onLongPress={onLongPress ? _onLongPress : null}
                delayLongPress={200}
                style={({pressed}) => [
                  bubbleStyles(isMe, prevSame, nextSame),
                  {backgroundColor: getDefaultBackgroundColor(isMe, pressed)},
                  reactions
                    ? {alignSelf: isMe ? 'flex-end' : 'flex-start'}
                    : {},
                  isMe ? myBubbleStyle(pressed) : otherBubbleStyle(pressed),
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{maxWidth: 500, color: isMe ? 'white' : 'black'}}>
                    {content?.text}
                  </Text>
                  {/* <Html html={content?.html} isMe={isMe} accentColor={accentColor} /> */}
                  {isMe && (
                    <View style={{marginLeft: 12, marginRight: -6}}>
                      {/* <Icon
                        name={status === EventStatus.SENDING ? 'circle' : 'check-circle'}
                        size={16}
                        color={
                          myBubbleStyle(false)?.backgroundColor
                            ? Color(myBubbleStyle(false).backgroundColor).darken(0.3).hex()
                            : Color(getDefaultBackgroundColor(isMe, false)).darken(0.3).hex()
                        }
                      /> */}
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </BubbleWrapper>
      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}

const Emoji = ({style, isMe, children}) => (
  <Text
    style={{
      ...style,
      fontSize: 45,
      marginHorizontal: 8,
      marginTop: isIos() ? 4 : -7,
      marginBottom: 4,
    }}>
    {children}
  </Text>
);

const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 18,
  ...(isMe
    ? {
        ...(prevSame ? {borderTopRightRadius: sharpBorderRadius} : {}),
        ...(nextSame ? {borderBottomRightRadius: sharpBorderRadius} : {}),
      }
    : {
        ...(prevSame ? {borderTopLeftRadius: sharpBorderRadius} : {}),
        ...(nextSame ? {borderBottomLeftRadius: sharpBorderRadius} : {}),
      }),
});

const viewStyle = (nextSame) => ({
  marginTop: 2,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
