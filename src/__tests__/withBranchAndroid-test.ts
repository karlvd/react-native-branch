import { AndroidConfig } from "@expo/config-plugins";
import { resolve } from "path";

import { getBranchApiKey, setBranchApiKey } from "../withBranchAndroid";

const { findMetaDataItem, getMainApplication, readAndroidManifestAsync } =
  AndroidConfig.Manifest;

const sampleManifestPath = resolve(
  __dirname,
  "./fixtures",
  "react-native-AndroidManifest.xml"
);

describe(getBranchApiKey, () => {
  it(`returns null if no android branch api key is provided`, () => {
    expect(getBranchApiKey({ android: { config: {} } } as any)).toBe(null);
  });

  it(`returns apikey if android branch api key is provided`, () => {
    expect(
      getBranchApiKey({
        android: { config: { branch: { apiKey: "MY-API-KEY" } } },
      } as any)
    ).toBe("MY-API-KEY");
  });
});

describe(setBranchApiKey, () => {
  it("sets branch api key in AndroidManifest.xml if given", async () => {
    let androidManifestJson = await readAndroidManifestAsync(
      sampleManifestPath
    );
    androidManifestJson = await setBranchApiKey(
      "MY-API-KEY",
      androidManifestJson
    );
    let mainApplication = getMainApplication(androidManifestJson);

    expect(
      findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey")
    ).toBeGreaterThan(-1);

    // Unset the item

    androidManifestJson = await setBranchApiKey(null, androidManifestJson);
    mainApplication = getMainApplication(androidManifestJson);

    expect(findMetaDataItem(mainApplication, "io.branch.sdk.BranchKey")).toBe(
      -1
    );
  });
});
