import {refreshTokenMetaModel} from "./db";
import {deviceViewType} from "../models/deviceViewModel";

class AuthRepositoryClass  {
  async createRefreshTokenMeta(device: any): Promise<void> {
    await refreshTokenMetaModel.create(device);
  }
  async updateRefreshTokenMeta(device: any): Promise<boolean> {
    const result = await refreshTokenMetaModel.updateOne(
      { deviceId: device.deviceId },
      {
        $set: {
          ip: device.ip,
          lastActiveDate: device.lastActiveDate,
          expirationDate: device.expirationDate,
        },
      }
    );

    return result.matchedCount === 1;
  }
  async findRefreshTokenMeta(deviceId: string) {
    const refreshTokenMeta = await refreshTokenMetaModel.findOne({
      deviceId: deviceId,
    });

    if (refreshTokenMeta) {
      return {
        ip: refreshTokenMeta.ip,
        title: refreshTokenMeta.title,
        lastActiveDate: refreshTokenMeta.lastActiveDate,
        deviceId: refreshTokenMeta.deviceId,
        userId: refreshTokenMeta.userId,
      };
    } else {
      return false;
    }
  }
  async deleteRefreshTokenMeta(deviceId: string): Promise<boolean> {
    const isDel = await refreshTokenMetaModel.deleteOne({
      deviceId: deviceId,
    });
    return isDel.deletedCount === 1;
  }
  async deleteALLRefreshTokenMetaByIdExceptMy(
    userId: string,
    deviceId: string
  ): Promise<boolean> {
    const isDel = await refreshTokenMetaModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return isDel.deletedCount === 1;
  }
  async findAllDevices(userId: string): Promise<deviceViewType[]> {
    const allDevices = await refreshTokenMetaModel
      .find({ userId: userId })
      .lean();
    return allDevices.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: new Date(d.lastActiveDate * 1000),
      deviceId: d.deviceId,
    }));
  }
  async findIsDeviceByDeviceId(deviceId: string): Promise<any>{
    const device = await refreshTokenMetaModel.find({
      deviceId: deviceId,
    });

    return device;
  }
};
export const authRepository = new AuthRepositoryClass();
