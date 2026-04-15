package types

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type UUIDArray []uuid.UUID

// pake interface{} karena fleksibel untuk
// tipe data apapun
func (a *UUIDArray) Scan(value interface{}) error {
	// isi value interface {3213214,wawfawfaf,424324234}
	var str string

	switch v := value.(type){
	case []byte : 
		str = string(v)
	case string:
		str = v
	default : 
		return errors.New("Failed to parse UUIDArray : unsupported data type")
	}

	str = strings.TrimPrefix(str, "{")
	str = strings.TrimSuffix(str, "}")
	parts := strings.Split(str, ",")

	// make([]T, length, capacity)
	*a = make(UUIDArray, 0,len(parts))
	// pake _ karena ga butuh index/id
	for _ , s := range parts {
		s = strings.TrimSpace(strings.Trim(s,`"`)) // akan menghapus spasi dan "
		if s== ""{
			continue
		}
		u,err := uuid.Parse(s)
		if err != nil {
			return fmt.Errorf("Invalid UUID in Array : %v",err)
		}
		*a = append(*a, u)
	}
	return nil
}

// Function mengubah value UUID menjadi format Postgres
func (a UUIDArray)Value()(driver.Value, error){
	if len(a) == 0 {
		return "{}",nil
	}
	postgreFormat := make([]string,0,len(a))
	for _,value := range a{
		postgreFormat = append(postgreFormat, fmt.Sprintf(`"%s"`, value.String())) // biar jadi {"awdawd", "dwadwadwa"}
	}
	return "{"+ strings.Join(postgreFormat,",")+"}" , nil
}

func (UUIDArray) GormDataType() string {
	return "uuid[]"
}