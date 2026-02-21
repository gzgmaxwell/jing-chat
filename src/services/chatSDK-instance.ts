// src/services/chatSDK-instance.ts
import { TIM } from "tim-js-sdk";
import { ChatSDK } from "@tencentcloud/chat-uikit-vue";

const sdkAppId = 123456789; // 替换为你的真实sdkAppId

// 初始化 tim 实例
const tim = TIM.create({
    sdkAppID: sdkAppId,
});

// 设置日志等级，方便调试
tim.setLogLevel(1);

// 创建 ChatSDK 实例，把 tim 实例传进去
const chatSDK = new ChatSDK({
    timInstance: tim,
});

/**
 * 登录腾讯云 IM
 * @param userID 用户 ID
 * @param userSig 用户身份签名
 * @returns 登录是否成功，true 或抛出错误
 */
export async function login(userID: string, userSig: string): Promise<boolean> {
    try {
        await tim.login({ userID, userSig });
        console.log("登录成功");
        return true;
    } catch (error) {
        console.error("登录失败", error);
        throw error;  // 让调用者感知失败
    }
}

export { chatSDK, tim };
