// VisibilityType is the resources public status.
enum VisibilityType {
  VISIBILITY_TYPE_UNSPECIFIED = 0,
  VISIBILITY_TYPE_PUBLIC_READ = 1,
  VISIBILITY_TYPE_PRIVATE = 2,
  // If the bucket Visibility is inherit, it's finally set to private. If the object Visibility is inherit, it's the same as bucket.
  VISIBILITY_TYPE_INHERIT = 3,
}

// RedundancyType represents the redundancy algorithm type for object data,
// which can be either multi-replica or erasure coding.
enum RedundancyType {
  REDUNDANCY_EC_TYPE = 0,
  REDUNDANCY_REPLICA_TYPE = 1,
}

// ObjectStatus represents the creation status of an object. After a user successfully
// sends a CreateObject transaction onto the chain, the status is set to 'Created'.
// After the Primary Service Provider successfully sends a Seal Object transaction onto
// the chain, the status is set to 'Sealed'.
enum ObjectStatus {
  OBJECT_STATUS_CREATED = 0,
  OBJECT_STATUS_SEALED = 1,
}

// SourceType represents the source of resource creation, which can
// from Greenfield native or from a cross-chain transfer from BSC
enum SourceType {
  SOURCE_TYPE_ORIGIN = 0,
  SOURCE_TYPE_BSC_CROSS_CHAIN = 1,
  SOURCE_TYPE_MIRROR_PENDING = 2,
}
