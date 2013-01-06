Provides WebDAV access to emergence-fs via jsDAV

# Unimplemented operations
* tree.copy
* file.delete

## Without use case:

* file.setName
* file.put
* file.get
* collection.setName
* collection.getQuotaInfo

# Known Issues
Many operations fail with "the specified path is not a folder" in Coda due to [jsDAV issue #66](https://github.com/mikedeboer/jsDAV/issues/66).