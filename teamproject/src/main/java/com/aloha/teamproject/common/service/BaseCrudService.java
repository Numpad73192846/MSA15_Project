package com.aloha.teamproject.common.service;

import java.util.List;

public interface BaseCrudService<T> {

    List<T> list() throws Exception;

    T selectById(String id) throws Exception;

    T selectByUsername(String username) throws Exception;

<<<<<<< HEAD
    T selectByNickname(String nickname) throws Exception;

=======
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
    boolean insert(T entity) throws Exception;

    boolean update(T entity) throws Exception;

    boolean delete(Long no) throws Exception;
    
}
