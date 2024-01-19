import dayjs from 'dayjs';
import Robot from 'dingtalk-robot-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export interface DingTalk {
  conversationId: string;
  atUsers: AtUser[];
  chatbotCorpId: string;
  chatbotUserId: string;
  msgId: string;
  senderNick: string;
  isAdmin: boolean;
  senderStaffId: string;
  sessionWebhookExpiredTime: number;
  createAt: number;
  senderCorpId: string;
  conversationType: string;
  senderId: string;
  conversationTitle: string;
  isInAtList: boolean;
  sessionWebhook: string;
  text: Text;
  robotCode: string;
  msgtype: string;
}

export interface AtUser {
  dingtalkId: string;
}

export interface Text {
  content: string;
}

function convertToChinaNum(num: number) {
  let arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let arr2 = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ]; //可继续追加更高位转换值
  if (!num || isNaN(num)) {
    return '零';
  }
  let english = num.toString().split('');
  let result = '';
  for (let i = 0; i < english.length; i++) {
    let des_i = english.length - 1 - i; //倒序排列设值
    result = arr2[i] + result;
    let arr1_index = parseInt(english[des_i]);
    result = arr1[arr1_index] + result;
  }
  //将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
  //合并中间多个零为一个零
  result = result.replace(/零+/g, '零');
  //将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
  //将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿');
  //移除末尾的零
  result = result.replace(/零+$/, '');
  //将【零一十】换成【零十】
  //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  //将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
}

const lastMeetingDate = process.env.DINGDINGLASTMEETINGDATE;
const preSident = process.env.DINGDINGPRESIDENT;
const mettingUserList = process.env.DINGDINGMETTINGUSERLIST?.split(',') || [];

const waitTime = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

function getNextMeetingDate(
  currentDate: string | number | Date,
  lastMeetingDate: string | number | Date,
  userIndex: number,
) {
  // 将日期字符串转换为 Date 对象
  const lastMeeting = new Date(lastMeetingDate);
  const current = new Date(currentDate);

  // 计算周会周期（两周）
  const meetingInterval = 14;

  // 计算下一次周会的日期
  const nextMeeting = new Date(lastMeeting.getTime() + meetingInterval * 24 * 60 * 60 * 1000);
  // 如果当前日期已经超过了下一次周会的日期，则需要向后推迟一周
  if (current > nextMeeting) {
    nextMeeting.setDate(nextMeeting.getDate() + 7);
    return getNextMeetingDate(currentDate, nextMeeting.toISOString().split('T')[0], userIndex + 1);
  }

  return {
    nextMeetingDate: nextMeeting.toISOString().split('T')[0],
    nextMeetingUser: mettingUserList[(userIndex % mettingUserList.length) + 1],
  };
}

const getMarkdown = () => {
  if (lastMeetingDate === undefined || preSident === undefined || mettingUserList === undefined) {
    return {};
  }
  const now = dayjs().format('YYYY-MM-DD');
  const nextMeetingDate = getNextMeetingDate(
    now,
    lastMeetingDate,
    mettingUserList.indexOf(preSident),
  );
  return {
    text: `
    #### 周会值班
    
    🔊  今天是 ${now} 星期${convertToChinaNum(dayjs().day())} 
      下次周会日期： ${nextMeetingDate.nextMeetingDate}
      
      主持人： @${nextMeetingDate.nextMeetingUser} 注意订会议室和收集议题哦~
      
      ------
    
      值班表：
      ${[...mettingUserList]
        .splice(
          mettingUserList.indexOf(nextMeetingDate.nextMeetingUser) + 1,
          mettingUserList.length,
        )
        .concat(
          [...mettingUserList].splice(
            0,
            mettingUserList.indexOf(nextMeetingDate.nextMeetingUser) + 1,
          ),
        )
        .map(
          (item, index) =>
            `- @${item} ${dayjs(nextMeetingDate.nextMeetingDate)
              .add(14 * (index + 1), 'day')
              .format('YYYY-MM-DD')}`,
        )
        .join('\n')}   
        `,
    list: [...mettingUserList]
      .splice(mettingUserList.indexOf(nextMeetingDate.nextMeetingUser) + 1, mettingUserList.length)
      .concat(
        [...mettingUserList].splice(
          0,
          mettingUserList.indexOf(nextMeetingDate.nextMeetingUser) + 1,
        ),
      )
      .map(
        (item, index) =>
          `- @${item} ${dayjs(nextMeetingDate.nextMeetingDate)
            .add(14 * (index + 1), 'day')
            .format('YYYY-MM-DD')}`,
      ),
  };
};

// const robot = new Robot({
//   accessToken: process.env.DINGDINGACCESSTOKEN,
//   secret: process.env.DINGDINGSECRET,
// });

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const payload = (await request.body) as DingTalk;

  console.log('payload', JSON.stringify(payload, null, 2));

  if (lastMeetingDate === undefined || preSident === undefined || mettingUserList === undefined) {
    return response.send(
      JSON.stringify({
        message: '请先配置相关变量',
      }),
    );
  }
  const content = getMarkdown();
  const markDown = new Robot.Markdown();

  markDown.setTitle('周会值班').add(`hi @${payload.senderNick},${content.text}

-----------

请注意预定会议室和手机分享资料哦~

${content.list?.slice(0, 3)}`);

  // await robot.send(markDown);

  await waitTime(100);

  return response.send(
    JSON.stringify({
      message: `hi @${payload.senderNick},${content.text}

      -----------
      
      请注意预定会议室和手机分享资料哦~
      
      ${content.list?.slice(0, 3).join('\n')}`,
      success: true,
    }),
  );
}
