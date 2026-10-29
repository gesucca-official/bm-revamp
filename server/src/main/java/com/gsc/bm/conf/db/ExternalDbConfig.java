package com.gsc.bm.conf.db;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import javax.sql.DataSource;
import java.nio.file.Path;

/** The legacy repository boundary now uses a separate writable SQLite file. */
@Configuration
public class ExternalDbConfig {
    @Bean(name = "dataSourceExternalDB")
    public DataSource dataSource(@Value("${app.database.path}") String path) {
        return ApplicationDatabase.open(Path.of(path));
    }
    @Bean(name = "applicationJdbc")
    public JdbcTemplate applicationJdbc(@Qualifier("dataSourceExternalDB") DataSource source) {
        return new JdbcTemplate(source);
    }
    @Bean(name = "externalDbTransactionManager")
    public PlatformTransactionManager transactionManager(@Qualifier("dataSourceExternalDB") DataSource source) {
        return new DataSourceTransactionManager(source);
    }
}
