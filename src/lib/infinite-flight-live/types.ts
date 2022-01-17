export interface ApiResponse<T> {
    errorCode: ErrorCode;
    result: T;
}

export enum ErrorCode {
    Ok,
    UserNotFound,
    MissingRequestParameters,
    InvalidToken,
    AuthProviderFailure,
    AccountAlreadyInUse,
    ExpiredToken,
    NetworkError,
    EndpointError,
    EndpointNotAuthorized,
    EndpointTimeout,
    NotSupported,
    InvalidInput,
    AccountSuspended,
    ServerNotFound,
    FlightNotFound,
    NoAtisAvailable,
}

export interface AtcEntry {
    frequencyId: string;
    userId: string;
    username: string;
    virtualOrganization: string;
    airportName: string;
    type: FrequencyType;
    latitude: number;
    longitude: number;
    startTime: Date;

    sessionInfo?: SessionInfo;
}

export enum FrequencyType {
    Ground,
    Tower,
    Unicom,
    Clearance,
    Approach,
    Departure,
    Center,
    ATIS,
    Aircraft,
    Recorded,
    Unknown,
    Unused,
}

export interface FlightEntry {
    flightId: string;
    userId: string;
    aircraftId: string;
    liveryId: string;
    username: string;
    virtualOrganization: string;
    callsign: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    verticalSpeed: number;
    track: number;
    heading: number;
    lastReport: Date;

    sessionInfo?: SessionInfo;
}

export interface FlightPlanEntry {
    flightPlanId: string;
    flightId: string;
    waypoints: string[];
    lastUpdate: Date;
}

export interface GradeRuleDefinition {
    name: string;
    description: string;
    property: string;
    operator: RuleOperator;
    period: number;
    order: number;
    group: number;
}

export enum RuleOperator {
    GreaterThan,
    LesserThan,
    GreaterThanOrEqual,
    LesserThanOrEqual,
    Equal,
    DifferentThan,
}

export interface GradeRule {
    ruleIndex: number;
    referenceValue: number;
    userValue: number;
    state: RulePassState;
    userValueString: string;
    referenceValueString: string;
    definition: GradeRuleDefinition;
}

export enum RulePassState {
    Fail,
    Ok,
    Warning,
}

export interface Grade {
    rules: GradeRule[];
    index: number;
    name: string;
    state: RulePassState;
}

export interface GradeConfiguration {
    grades: Grade[];
    gradeIndex: number;
}

export interface ReportEntry {
    type: number;
    creationTime: Date;
    creatorId: string;
    description: string;
    flightId: string;
}

export interface ViolationEntry {
    type: number;
    date: Date;
}

export enum AtcRank {
    Observer,
    Trainee,
    Apprentice,
    Specialist,
    Officer,
    Supervisor,
    Recruiter,
    Manager,
}

export interface GradeInfo {
    gradeDetails: GradeConfiguration;
    reports: ReportEntry[];
    violations: ViolationEntry[];
    totalXP: number;
    atcOperations: number;
    atcRank?: AtcRank;
}

export interface SessionInfo {
    id: string;
    name: string;
    maxUsers: number;
    userCount: number;
    type: SessionType;
}

export enum SessionType {
    Restricted,
    Unrestricted,
}

export interface UserGradeInfo {
    userId: string;
    virtualOrganization: string;
    discourseUsername: string;
    groups: string[];
    pilotStats: GradeInfo;
}

export interface UserStats {
    userId: string;
    virtualOrganization: string;
    discourseUsername: string;
    groups: string[];
    errorCode: ErrorCode;
    onlineFlights: number;
    violations: number;
    xp: number;
    landingCount: number;
    flightTime: number;
    atcOperations: number;
    atcRank: AtcRank;
    grade: number;
    hash: string;
}

export interface Airport {
    id: number;
    icaoCode: string;
    type: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    country: string;
    city: string;
    iataCode: string;
    frequencies: AirportFrequency[];
    runways: AirportRunway[];
}

export interface AirportFrequency {
    id: number;
    type: string;
    desciption: string;
    frequency: number;
}

export interface AirportRunway {
    id: number;
    length: number;
    width: number;
    closed: boolean;
    identL: string;
    latitudeL: number;
    longitudeL: number;
    elevationL: number;
    headingL: number;
    displacedThresholdL: number;
    identH: string;
    latitudeH: number;
    longitudeH: number;
    elevationH: number;
    headingH: number;
    displacedThresholdH: number;
}

export interface Aircraft {
    liveryId: string;
    aircraftId: string;
    aircraftName: string;
    liveryName: string;
    maxTakeoffWeight: number;
    maxLandingWeight: number;
    neverExceed: string;
    serviceCeiling: number;
    range: number;
    apprSpeedRe: number;
    maxPassengers: number;
}

export interface AirportStatus {
    airportIcao: string;
    inboundFlightsCount: number;
    inboundFlights: string[];
    outboundFlightsCount: number;
    outboundFlights: string[];
    atcFacilities: AtcEntry[];

    sessionInfo?: SessionInfo;
}

export interface OceanicTrack {
    name: string;
    path: string[];
    eastLevels: number[] | null;
    westLevels: number[] | null;
    type: string;
    lastSeen: string;
}

/**
 * Robust Types
 *
 * These are types that do not mirror the resources that the Infinite Flight Live API returns.
 * As such, some of these types may be require multiple requests to different API endpoints to be instantiated.
 */

// Name is InfiniteFlightSession since "Session" is more suseptible to naming collisions
export interface InfiniteFlightSession {
    sessionInfo: SessionInfo;
    flights: FlightEntry[];
    airportStatuses: AirportStatus[];
    atcFacilities: AtcEntry[];
}

export interface InfiniteFlightStatus {
    sessions: InfiniteFlightSession[];
}
