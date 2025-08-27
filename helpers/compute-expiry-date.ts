interface JobData {
  created_timestamp: string;
  duration: string;
}

interface ExpirationResult {
  created: Date;
  earliestExpiration?: Date;
  latestExpiration?: Date;
  durationRange?: string;
  error?: string;
}

function calculateExpirationDate(jobData: JobData): ExpirationResult {
  // Parse the created timestamp
  const createdDate = new Date(jobData.created_timestamp);

  // Extract duration information
  const durationText = jobData?.duration;

  // Parse the duration range
  const durationParts = durationText?.match(/(\d+)-(\d+)\s+(\w+)/);

  if (!durationParts) {
    return {
      error: "Unable to parse duration format",
      created: createdDate,
    };
  }

  const minDuration = parseInt(durationParts[1]);
  const maxDuration = parseInt(durationParts[2]);
  const durationUnit = durationParts[3].toLowerCase();

  // Calculate earliest and latest expiration dates
  let earliestExpiration: Date | undefined, latestExpiration: Date | undefined;

  if (durationUnit.includes("month")) {
    earliestExpiration = new Date(createdDate);
    earliestExpiration.setMonth(earliestExpiration.getMonth() + minDuration);

    latestExpiration = new Date(createdDate);
    latestExpiration.setMonth(latestExpiration.getMonth() + maxDuration);
  } else if (durationUnit.includes("week")) {
    earliestExpiration = new Date(
      createdDate.getTime() + minDuration * 7 * 24 * 60 * 60 * 1000
    );
    latestExpiration = new Date(
      createdDate.getTime() + maxDuration * 7 * 24 * 60 * 60 * 1000
    );
  } else if (durationUnit.includes("day")) {
    earliestExpiration = new Date(
      createdDate.getTime() + minDuration * 24 * 60 * 60 * 1000
    );
    latestExpiration = new Date(
      createdDate.getTime() + maxDuration * 24 * 60 * 60 * 1000
    );
  } else {
    return {
      error: "Unknown duration unit",
      created: createdDate,
    };
  }

  return {
    created: createdDate,
    earliestExpiration: earliestExpiration,
    latestExpiration: latestExpiration,
    durationRange: `${minDuration}-${maxDuration} ${durationUnit}`,
  };
}

export default calculateExpirationDate;
